<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MusicIcon from '@lucide/svelte/icons/music';
	import { searchSongs } from '$lib/api/songs';
	import { getPlaylists, addSongToPlaylist } from '$lib/api/playlist';
	import type { SongSearchResult } from '$lib/types/songs';
	import type { PlaylistResponse } from '$lib/types/playlist';
	import type { LayoutData } from '../$types';

	let { data }: { data: LayoutData } = $props();

	// State untuk search
	let searchQuery = $state('');
	let searchResults = $state<SongSearchResult[]>([]);
	let isSearching = $state(false);
	let hasSearched = $state(false);
	let errorMessage = $state('');

	// State untuk playlists dropdown
	let playlists = $state<PlaylistResponse[]>(data.playlists || []);

	// State untuk adding song
	let addingToPlaylist = $state<Record<number, boolean>>({});
	let addedSongs = $state<Record<number, number>>({});

	// Debounce timer
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Handle search input dengan debounce
	function handleSearchInput() {
		if (debounceTimer) clearTimeout(debounceTimer);

		if (searchQuery.trim().length < 2) {
			searchResults = [];
			hasSearched = false;
			return;
		}

		debounceTimer = setTimeout(() => {
			performSearch();
		}, 500);
	}

	// Lakukan pencarian
	async function performSearch() {
		if (searchQuery.trim().length < 2) return;

		isSearching = true;
		errorMessage = '';
		hasSearched = true;

		try {
			searchResults = await searchSongs(searchQuery.trim(), 15);
		} catch (error) {
			console.error('Search failed:', error);
			errorMessage = error instanceof Error ? error.message : 'Search failed';
			searchResults = [];
		} finally {
			isSearching = false;
		}
	}

	// Handle form submit
	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (debounceTimer) clearTimeout(debounceTimer);
		performSearch();
	}

	// Tambah lagu ke playlist
	async function handleAddToPlaylist(song: SongSearchResult, playlistId: number) {
		const key = song.id;
		addingToPlaylist[key] = true;

		try {
			await addSongToPlaylist(playlistId, {
				song_title: song.title,
				song_artist: song.artist
			});
			addedSongs[key] = playlistId;
		} catch (error) {
			console.error('Failed to add song:', error);
		} finally {
			addingToPlaylist[key] = false;
		}
	}
</script>

<div class="flex flex-col gap-6 p-6">
	<!-- Header -->
	<div class="space-y-2">
		<h1 class="text-3xl font-bold tracking-tight">Search</h1>
		<p class="text-muted-foreground">Find songs and add them to your playlists</p>
	</div>

	<!-- Search Bar -->
	<form onsubmit={handleSubmit} class="flex max-w-xl gap-2">
		<div class="relative flex-1">
			<SearchIcon class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="search"
				placeholder="Search for songs or artists..."
				class="pl-10"
				bind:value={searchQuery}
				oninput={handleSearchInput}
			/>
		</div>
		<Button type="submit" disabled={isSearching || searchQuery.trim().length < 2}>
			{#if isSearching}
				Searching...
			{:else}
				Search
			{/if}
		</Button>
	</form>

	<!-- Error Message -->
	{#if errorMessage}
		<div class="max-w-xl rounded-md bg-destructive/10 p-3 text-sm text-destructive">
			{errorMessage}
		</div>
	{/if}

	<!-- Search Results -->
	{#if isSearching}
		<div class="flex items-center justify-center py-12">
			<div class="animate-pulse text-muted-foreground">Searching...</div>
		</div>
	{:else if hasSearched && searchResults.length === 0}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<MusicIcon class="mb-4 h-12 w-12 text-muted-foreground" />
			<p class="text-muted-foreground">No songs found for "{searchQuery}"</p>
			<p class="text-sm text-muted-foreground">Try searching with different keywords</p>
		</div>
	{:else if searchResults.length > 0}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each searchResults as song (song.id)}
				<Card.Root class="overflow-hidden transition-colors hover:bg-accent/50">
					<div class="relative aspect-square overflow-hidden bg-muted">
						{#if song.thumbnail}
							<img src={song.thumbnail} alt={song.title} class="h-full w-full object-cover" />
						{:else}
							<div
								class="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-blue-500"
							>
								<MusicIcon class="h-16 w-16 text-white/80" />
							</div>
						{/if}
					</div>
					<Card.Content class="p-4">
						<h3 class="truncate font-semibold" title={song.title}>{song.title}</h3>
						<p class="truncate text-sm text-muted-foreground" title={song.artist}>{song.artist}</p>
						<div class="mt-3 flex items-center gap-2">
							{#if addedSongs[song.id]}
								<span class="text-xs text-green-600 dark:text-green-400">Added!</span>
							{:else}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger>
										{#snippet child({ props })}
											<Button
												{...props}
												size="sm"
												variant="outline"
												class="w-full"
												disabled={addingToPlaylist[song.id]}
											>
												<PlusIcon class="mr-1 h-4 w-4" />
												{#if addingToPlaylist[song.id]}
													Adding...
												{:else}
													Add to Playlist
												{/if}
											</Button>
										{/snippet}
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="start">
										{#each playlists as playlist (playlist.id)}
											<DropdownMenu.Item onclick={() => handleAddToPlaylist(song, playlist.id)}>
												{playlist.title}
											</DropdownMenu.Item>
										{:else}
											<DropdownMenu.Item disabled>No playlists available</DropdownMenu.Item>
										{/each}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{/if}
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	{:else if !hasSearched}
		<div class="flex flex-col items-center justify-center py-12 text-center">
			<SearchIcon class="mb-4 h-12 w-12 text-muted-foreground" />
			<p class="text-muted-foreground">Start typing to search for songs</p>
		</div>
	{/if}
</div>
