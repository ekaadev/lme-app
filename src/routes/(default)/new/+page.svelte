<script lang="ts">
	import { Button } from '@/components/ui/button/index.js';
	import { Badge } from '@/components/ui/badge/index.js';
	import { onMount } from 'svelte';

	import MusicIcon from '@lucide/svelte/icons/music';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import SendIcon from '@lucide/svelte/icons/send';
	import XIcon from '@lucide/svelte/icons/x';

	type Song = {
		id: string;
		title: string;
		artist: string;
		album: string;
		imageUrl: string;
	};

	let selectedSongs = $state<Song[]>([]);
	let explanation = $state('');
	let isLoading = $state(false);

	onMount(() => {
		const handleAddSong = (event: CustomEvent) => {
			const song = event.detail;
			if (song && !selectedSongs.find((s) => s.id === song.id)) {
				selectedSongs = [...selectedSongs, song];
			}
		};

		window.addEventListener('add-song', handleAddSong as EventListener);
		return () => window.removeEventListener('add-song', handleAddSong as EventListener);
	});

	function removeSong(songId: string) {
		selectedSongs = selectedSongs.filter((s) => s.id !== songId);
	}

	async function sendMessage() {
		if (selectedSongs.length === 0 || isLoading) return;

		isLoading = true;
		explanation = '';

		// Simulate API call
		setTimeout(() => {
			let result = '';

			selectedSongs.forEach((song, index) => {
				result += `**${song.title} - ${song.artist}**\n\n`;
				result += `Lagu "${song.title}" yang dibawakan oleh ${song.artist} dari album ${song.album} adalah sebuah karya yang memiliki makna mendalam. `;
				result += `Lagu ini mengangkat tema tentang kehidupan, cinta, dan perjalanan emosional yang disampaikan melalui lirik yang puitis dan penuh makna. `;
				result += `${song.artist} berhasil menyampaikan pesan yang menyentuh hati pendengar melalui melodi yang memorable dan lirik yang kaya akan filosofi.\n\n`;

				if (index < selectedSongs.length - 1) {
					result += '---\n\n';
				}
			});

			explanation = result;
			isLoading = false;
		}, 2000);
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
		<div class="mx-auto w-full max-w-4xl">
			{#if isLoading}
				<div class="flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
					<SparklesIcon class="size-5 animate-spin text-primary" />
					<span class="text-sm text-muted-foreground">Sedang menganalisis lirik...</span>
				</div>
			{:else if explanation}
				<div class="rounded-lg border bg-card p-6">
					<h3 class="mb-4 text-lg font-semibold text-primary">Penjelasan Lirik</h3>
					<div class="prose prose-sm dark:prose-invert max-w-none">
						{@html explanation
							.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
							.replace(/\n/g, '<br>')
							.replace(/---/g, '<hr class="my-4">')}
					</div>
				</div>
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
							yang mendalam
						</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
