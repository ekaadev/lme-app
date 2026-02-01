<script lang="ts">
	import { Button } from '@/components/ui/button/index.js';
	import { Badge } from '@/components/ui/badge/index.js';
	import { onMount } from 'svelte';

	import MusicIcon from '@lucide/svelte/icons/music';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import SendIcon from '@lucide/svelte/icons/send';
	import XIcon from '@lucide/svelte/icons/x';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import SmileIcon from '@lucide/svelte/icons/smile';
	import FrownIcon from '@lucide/svelte/icons/frown';
	import MehIcon from '@lucide/svelte/icons/meh';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	import { explainSongs } from '$lib/api/songs';
	import { createHistory } from '$lib/api/history';
	import { explainStore, type SelectedSong } from '$lib/stores/explain.svelte';
	import type { ExplainResult } from '$lib/types/songs';

	// State untuk lagu yang dipilih
	let selectedSongs = $state<SelectedSong[]>([]);
	let explanationResults = $state<ExplainResult[]>([]);
	let isLoading = $state(false);
	let errorMessage = $state('');

	// Sync dengan store
	$effect(() => {
		selectedSongs = explainStore.songs;
	});

	onMount(() => {
		const handleAddSong = (event: CustomEvent) => {
			const song = event.detail;
			if (song) {
				explainStore.addSong({
					id: parseInt(song.id) || Date.now(),
					title: song.title,
					artist: song.artist,
					thumbnail: song.imageUrl
				});
			}
		};

		window.addEventListener('add-song', handleAddSong as EventListener);
		return () => window.removeEventListener('add-song', handleAddSong as EventListener);
	});

	function removeSong(songId: number) {
		explainStore.removeSong(songId);
	}

	// Get emotion icon based on emotion string
	function getEmotionIcon(emotion: string) {
		const lowerEmotion = emotion.toLowerCase();
		if (lowerEmotion.includes('happy') || lowerEmotion.includes('joy')) return SmileIcon;
		if (lowerEmotion.includes('sad') || lowerEmotion.includes('grief')) return FrownIcon;
		if (lowerEmotion.includes('love') || lowerEmotion.includes('romantic')) return HeartIcon;
		if (lowerEmotion.includes('anger') || lowerEmotion.includes('fear')) return AlertCircleIcon;
		return MehIcon;
	}

	// Get emotion color class
	function getEmotionColor(emotion: string): string {
		const lowerEmotion = emotion.toLowerCase();
		if (lowerEmotion.includes('happy') || lowerEmotion.includes('joy'))
			return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
		if (lowerEmotion.includes('sad') || lowerEmotion.includes('grief'))
			return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
		if (lowerEmotion.includes('love') || lowerEmotion.includes('romantic'))
			return 'bg-pink-500/10 text-pink-600 dark:text-pink-400';
		if (lowerEmotion.includes('anger')) return 'bg-red-500/10 text-red-600 dark:text-red-400';
		if (lowerEmotion.includes('fear'))
			return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
		return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
	}

	async function sendMessage() {
		if (selectedSongs.length === 0 || isLoading) return;

		isLoading = true;
		errorMessage = '';
		explanationResults = [];

		try {
			// Prepare songs for API
			const songsToExplain = selectedSongs.map((s) => ({
				title: s.title,
				artist: s.artist
			}));

			// Call explain API
			const response = await explainSongs({
				songs: songsToExplain,
				language_code: 'id'
			});

			explanationResults = response.results;

			// Save each result to history
			for (const result of response.results) {
				if (!result.error) {
					try {
						await createHistory({
							song_title: result.song_title,
							song_artist: result.song_artist,
							interpretation: result.interpretation,
							emotion: result.emotion?.emotion || '',
							language_code: 'id'
						});
					} catch (historyError) {
						console.error('Failed to save to history:', historyError);
					}
				}
			}

			// Clear selected songs after successful explain
			explainStore.clear();
		} catch (error) {
			console.error('Explain failed:', error);
			errorMessage = error instanceof Error ? error.message : 'Gagal menjelaskan lagu';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex h-full flex-col overflow-hidden">
	<!-- Input Area (Fixed at Top) -->
	<div class="border-b bg-background p-4">
		<div class="mx-auto flex w-full max-w-4xl items-center gap-3">
			<!-- Selected Songs (Multiselect) -->
			<div class="flex flex-1 flex-wrap gap-2">
				{#if selectedSongs.length > 0}
					{#each selectedSongs as song (song.id)}
						<Badge variant="secondary" class="gap-2 pr-1">
							<MusicIcon class="size-3" />
							<span class="text-xs">{song.title} - {song.artist}</span>
							<Button
								size="icon"
								variant="ghost"
								class="hover:text-destructive-foreground h-4 w-4 rounded-full p-0 hover:bg-destructive"
								onclick={() => removeSong(song.id)}
							>
								<XIcon class="size-3" />
							</Button>
						</Badge>
					{/each}
				{:else}
					<p class="text-sm text-muted-foreground">Pilih lagu dari sidebar kanan...</p>
				{/if}
			</div>

			<!-- Send Button -->
			<Button
				size="icon"
				onclick={sendMessage}
				disabled={selectedSongs.length === 0 || isLoading}
				class="h-10 w-10 shrink-0"
			>
				<SendIcon class="size-5" />
			</Button>
		</div>
	</div>

	<!-- Explanation Area (Scrollable) -->
	<div class="flex-1 overflow-y-auto p-6">
		<div class="mx-auto w-full max-w-4xl space-y-6">
			{#if errorMessage}
				<div
					class="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
				>
					{errorMessage}
				</div>
			{/if}

			{#if isLoading}
				<div class="flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
					<SparklesIcon class="size-5 animate-pulse text-primary" />
					<span class="text-sm text-muted-foreground">Sedang menganalisis lirik...</span>
				</div>
			{:else if explanationResults.length > 0}
				{#each explanationResults as result, index (result.id || index)}
					<div class="space-y-4 rounded-lg border bg-card p-6">
						<!-- Song Header -->
						<div class="flex items-start justify-between">
							<div>
								<h3 class="text-lg font-semibold">{result.song_title}</h3>
								<p class="text-sm text-muted-foreground">{result.song_artist}</p>
							</div>
							{#if result.emotion}
								{@const EmotionIcon = getEmotionIcon(result.emotion.emotion)}
								<Badge class={getEmotionColor(result.emotion.emotion)}>
									<EmotionIcon class="mr-1 size-3" />
									{result.emotion.emotion}
									{#if result.emotion.confidence}
										<span class="ml-1 opacity-70">
											({Math.round(result.emotion.confidence * 100)}%)
										</span>
									{/if}
								</Badge>
							{/if}
						</div>

						<!-- Error Message -->
						{#if result.error}
							<div class="rounded bg-destructive/10 p-3 text-sm text-destructive">
								{result.error}
							</div>
						{:else}
							<!-- Interpretation -->
							{#if result.interpretation}
								<div class="space-y-2">
									<h4 class="text-sm font-medium text-primary">Interpretasi</h4>
									<div class="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
										{@html result.interpretation
											.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
											.replace(/\n/g, '<br>')}
									</div>
								</div>
							{/if}

							<!-- Lyrics Preview -->
							{#if result.lyrics}
								<details class="group">
									<summary class="cursor-pointer text-sm font-medium text-primary hover:underline">
										Lihat Lirik
									</summary>
									<div
										class="mt-2 max-h-60 overflow-y-auto rounded bg-muted/50 p-4 text-sm whitespace-pre-wrap"
									>
										{result.lyrics}
									</div>
								</details>
							{/if}

							<!-- All Emotions -->
							{#if result.emotion?.all_emotions}
								<details class="group">
									<summary class="cursor-pointer text-sm font-medium text-primary hover:underline">
										Detail Emosi
									</summary>
									<div class="mt-2 flex flex-wrap gap-2">
										{#each Object.entries(result.emotion.all_emotions) as [emotion, score]}
											<Badge variant="outline" class="text-xs">
												{emotion}: {Math.round((score as number) * 100)}%
											</Badge>
										{/each}
									</div>
								</details>
							{/if}
						{/if}
					</div>
				{/each}
			{:else}
				<div class="flex h-full items-center justify-center">
					<div class="max-w-md space-y-4 text-center">
						<div
							class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10"
						>
							<SparklesIcon class="size-8 text-primary" />
						</div>
						<h2 class="text-xl font-semibold">Penjelasan Lirik Lagu</h2>
						<p class="text-sm text-muted-foreground">
							Pilih lagu dari sidebar kanan dan klik tombol kirim untuk mendapatkan penjelasan lirik
							yang mendalam beserta analisis emosi
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
