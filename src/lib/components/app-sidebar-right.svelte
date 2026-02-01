<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Sidebar from '@/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import type { ComponentProps } from 'svelte';

	import SearchIcon from '@lucide/svelte/icons/search';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MusicIcon from '@lucide/svelte/icons/music';
	import LoaderIcon from '@lucide/svelte/icons/loader';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import ListMusicIcon from '@lucide/svelte/icons/list-music';

	import { searchSongs } from '$lib/api/songs';
	import { getPlaylists, addSongToPlaylist } from '$lib/api/playlist';
	import { explainStore } from '$lib/stores/explain.svelte';
	import type { SongSearchResult } from '$lib/types/songs';
	import type { PlaylistResponse } from '$lib/types/playlist';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	// State untuk search
	let searchQuery = $state('');
	let searchResults = $state<SongSearchResult[]>([]);
	let isSearching = $state(false);
	let hasSearched = $state(false);

	// State untuk playlists
	let playlists = $state<PlaylistResponse[]>([]);
	let loadingPlaylists = $state(false);

	// State untuk adding song
	let addingToPlaylist = $state<Record<number, boolean>>({});
	let addedToPlaylist = $state<Record<number, boolean>>({});
	let addedToExplain = $state<Record<number, boolean>>({});

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
		hasSearched = true;

		try {
			searchResults = await searchSongs(searchQuery.trim(), 10);
		} catch (error) {
			console.error('Search failed:', error);
			searchResults = [];
		} finally {
			isSearching = false;
		}
	}

	// Load playlists saat dropdown dibuka
	async function loadPlaylists() {
		if (playlists.length > 0 || loadingPlaylists) return;

		loadingPlaylists = true;
		try {
			playlists = await getPlaylists(0, 50);
		} catch (error) {
			console.error('Failed to load playlists:', error);
		} finally {
			loadingPlaylists = false;
		}
	}

	// Tambah lagu ke playlist
	async function handleAddToPlaylist(song: SongSearchResult, playlistId: number) {
		addingToPlaylist[song.id] = true;

		try {
			await addSongToPlaylist(playlistId, {
				song_title: song.title,
				song_artist: song.artist
			});
			addedToPlaylist[song.id] = true;
		} catch (error) {
			console.error('Failed to add song:', error);
		} finally {
			addingToPlaylist[song.id] = false;
		}
	}

	// Tambah lagu ke explain (main content)
	function handleAddToExplain(song: SongSearchResult) {
		explainStore.addSong(song);
		addedToExplain[song.id] = true;

		// Dispatch event untuk main content (backward compatibility)
		window.dispatchEvent(
			new CustomEvent('add-song', {
				detail: {
					id: song.id.toString(),
					title: song.title,
					artist: song.artist,
					album: '',
					imageUrl: song.thumbnail || ''
				}
			})
		);
	}
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header class="space-y-2 p-4">
		<h2 class="text-lg font-semibold">Cari lagu</h2>
		<p class="text-sm text-muted-foreground">Cari lagu untuk dijelaskan atau simpan ke playlist</p>
		<InputGroup.Root>
			<InputGroup.Input
				bind:value={searchQuery}
				placeholder="Cari judul atau artis..."
				oninput={handleSearchInput}
			/>
			<InputGroup.Addon>
				{#if isSearching}
					<LoaderIcon class="size-4 animate-spin" />
				{:else}
					<SearchIcon class="size-4" />
				{/if}
			</InputGroup.Addon>
		</InputGroup.Root>
	</Sidebar.Header>
	<Sidebar.Content>
		<div class="space-y-2 p-2">
			{#if isSearching}
				<!-- Loading state -->
				<div class="py-8 text-center text-sm text-muted-foreground">
					<LoaderIcon class="mx-auto mb-2 size-6 animate-spin" />
					<p>Mencari...</p>
				</div>
			{:else if hasSearched && searchResults.length === 0}
				<!-- No results -->
				<div class="py-8 text-center text-sm text-muted-foreground">
					<MusicIcon class="mx-auto mb-2 size-8 opacity-50" />
					<p>Tidak ada lagu ditemukan</p>
				</div>
			{:else if searchResults.length > 0}
				<!-- Search results -->
				{#each searchResults as song (song.id)}
					<div
						class="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
					>
						<!-- Thumbnail -->
						{#if song.thumbnail}
							<img
								src={song.thumbnail}
								alt={song.title}
								class="h-12 w-12 rounded-md object-cover"
							/>
						{:else}
							<div
								class="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-blue-500"
							>
								<MusicIcon class="size-5 text-white" />
							</div>
						{/if}

						<!-- Song Info -->
						<div class="flex-1 overflow-hidden">
							<p class="truncate text-sm font-medium">{song.title}</p>
							<p class="truncate text-xs text-muted-foreground">{song.artist}</p>
						</div>

						<!-- Action Buttons -->
						<div
							class="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
						>
							<!-- Add to Explain Button -->
							{#if addedToExplain[song.id]}
								<span class="px-2 text-xs text-green-600 dark:text-green-400">Added!</span>
							{:else}
								<Button
									size="icon"
									variant="ghost"
									class="h-8 w-8"
									onclick={() => handleAddToExplain(song)}
									title="Add to Explain"
								>
									<SparklesIcon class="size-4" />
								</Button>
							{/if}

							<!-- Add to Playlist Dropdown -->
							<DropdownMenu.Root onOpenChange={(open) => open && loadPlaylists()}>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button
											{...props}
											size="icon"
											variant="ghost"
											class="h-8 w-8"
											disabled={addingToPlaylist[song.id]}
											title="Add to Playlist"
										>
											{#if addingToPlaylist[song.id]}
												<LoaderIcon class="size-4 animate-spin" />
											{:else}
												<ListMusicIcon class="size-4" />
											{/if}
										</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									<DropdownMenu.Label>Add to playlist</DropdownMenu.Label>
									<DropdownMenu.Separator />
									{#if loadingPlaylists}
										<DropdownMenu.Item disabled>Loading...</DropdownMenu.Item>
									{:else if playlists.length === 0}
										<DropdownMenu.Item disabled>No playlists</DropdownMenu.Item>
									{:else}
										{#each playlists as playlist (playlist.id)}
											<DropdownMenu.Item onclick={() => handleAddToPlaylist(song, playlist.id)}>
												{playlist.title}
											</DropdownMenu.Item>
										{/each}
									{/if}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</div>
				{/each}
			{:else}
				<!-- Initial state -->
				<div class="py-8 text-center text-sm text-muted-foreground">
					<SearchIcon class="mx-auto mb-2 size-8 opacity-50" />
					<p>Ketik untuk mencari lagu</p>
				</div>
			{/if}
		</div>
	</Sidebar.Content>
</Sidebar.Root>
