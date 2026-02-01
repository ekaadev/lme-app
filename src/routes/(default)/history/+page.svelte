<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import HistoryIcon from '@lucide/svelte/icons/history';
	import MusicIcon from '@lucide/svelte/icons/music';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import { getHistory, searchHistory } from '$lib/api/history';
	import type { HistoryListResponse } from '$lib/types/history';
	import { onMount } from 'svelte';

	let historyList = $state<HistoryListResponse[]>([]);
	let isLoading = $state(true);
	let searchQuery = $state('');
	let isSearching = $state(false);
	let debounceTimer: ReturnType<typeof setTimeout>;

	onMount(async () => {
		await loadHistory();
	});

	async function loadHistory() {
		isLoading = true;
		try {
			historyList = await getHistory(0, 50);
		} catch (error) {
			console.error('Failed to load history:', error);
		} finally {
			isLoading = false;
		}
	}

	function handleSearchInput() {
		if (debounceTimer) clearTimeout(debounceTimer);

		if (searchQuery.trim().length === 0) {
			loadHistory();
			return;
		}

		debounceTimer = setTimeout(() => {
			performSearch();
		}, 500);
	}

	async function performSearch() {
		if (searchQuery.trim().length === 0) return;

		isSearching = true;
		try {
			historyList = await searchHistory(searchQuery.trim());
		} catch (error) {
			console.error('Search failed:', error);
		} finally {
			isSearching = false;
		}
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getEmotionColor(emotion: string): string {
		const lowerEmotion = emotion.toLowerCase();
		if (lowerEmotion.includes('happy') || lowerEmotion.includes('joy'))
			return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
		if (lowerEmotion.includes('sad') || lowerEmotion.includes('grief'))
			return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
		if (lowerEmotion.includes('love') || lowerEmotion.includes('romantic'))
			return 'bg-pink-500/10 text-pink-600 dark:text-pink-400';
		if (lowerEmotion.includes('anger')) return 'bg-red-500/10 text-red-600 dark:text-red-400';
		return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="space-y-1">
			<h1 class="text-3xl font-bold tracking-tight">History</h1>
			<p class="text-muted-foreground">Riwayat penjelasan lirik lagu</p>
		</div>
	</div>

	<!-- Search Bar -->
	<div class="flex max-w-xl gap-2">
		<div class="relative flex-1">
			<SearchIcon class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Cari lagu..."
				class="pl-10"
				bind:value={searchQuery}
				oninput={handleSearchInput}
			/>
		</div>
	</div>

	<!-- History List -->
	{#if isLoading || isSearching}
		<div class="flex items-center justify-center py-12">
			<LoaderIcon class="h-6 w-6 animate-spin text-muted-foreground" />
		</div>
	{:else if historyList.length === 0}
		<div class="flex flex-col items-center justify-center py-16 text-center">
			<HistoryIcon class="mb-4 h-16 w-16 text-muted-foreground" />
			<h3 class="mb-2 text-xl font-semibold">Belum ada riwayat</h3>
			<p class="mb-4 text-muted-foreground">Jelaskan lagu untuk melihat riwayat di sini</p>
			<Button onclick={() => (window.location.href = '/new')}>Jelaskan Lagu</Button>
		</div>
	{:else}
		<div class="grid gap-4">
			{#each historyList as item (item.id)}
				<a
					href="/history/{item.id}"
					class="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
				>
					<!-- Music Icon -->
					<div
						class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-blue-500"
					>
						<MusicIcon class="h-7 w-7 text-white" />
					</div>

					<!-- Song Info -->
					<div class="min-w-0 flex-1">
						<p class="truncate font-medium">{item.song_title}</p>
						<p class="truncate text-sm text-muted-foreground">{item.song_artist}</p>
						<p class="mt-1 text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
					</div>

					<!-- Emotion Badge -->
					{#if item.emotion}
						<Badge class={getEmotionColor(item.emotion)}>
							{item.emotion}
						</Badge>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</div>
