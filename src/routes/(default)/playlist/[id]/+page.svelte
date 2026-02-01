<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';
	import PencilIcon from '@lucide/svelte/icons/pencil';
	import MusicIcon from '@lucide/svelte/icons/music';
	import SearchIcon from '@lucide/svelte/icons/search';
	import { updatePlaylist, deletePlaylist, removeSongFromPlaylist } from '$lib/api/playlist';
	import { goto, invalidateAll } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// State untuk playlist editing
	let isEditingTitle = $state(false);
	let isEditingDescription = $state(false);
	let editTitle = $state(data.playlist.title);
	let editDescription = $state(data.playlist.description || '');
	let isSaving = $state(false);
	let isDeleting = $state(false);
	let deletingSongId = $state<number | null>(null);

	// Format tanggal
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	// Save title
	async function saveTitle() {
		if (editTitle.trim() === data.playlist.title) {
			isEditingTitle = false;
			return;
		}

		isSaving = true;
		try {
			await updatePlaylist(data.playlist.id, { title: editTitle.trim() });
			data.playlist.title = editTitle.trim();
			await invalidateAll();
		} catch (error) {
			console.error('Failed to update title:', error);
			editTitle = data.playlist.title;
		} finally {
			isSaving = false;
			isEditingTitle = false;
		}
	}

	// Save description
	async function saveDescription() {
		if (editDescription.trim() === (data.playlist.description || '')) {
			isEditingDescription = false;
			return;
		}

		isSaving = true;
		try {
			await updatePlaylist(data.playlist.id, { description: editDescription.trim() });
			data.playlist.description = editDescription.trim();
			await invalidateAll();
		} catch (error) {
			console.error('Failed to update description:', error);
			editDescription = data.playlist.description || '';
		} finally {
			isSaving = false;
			isEditingDescription = false;
		}
	}

	// Delete playlist
	async function handleDeletePlaylist() {
		if (!confirm('Are you sure you want to delete this playlist?')) return;

		isDeleting = true;
		try {
			await deletePlaylist(data.playlist.id);
			await goto('/new');
		} catch (error) {
			console.error('Failed to delete playlist:', error);
		} finally {
			isDeleting = false;
		}
	}

	// Remove song from playlist
	async function handleRemoveSong(songId: number) {
		deletingSongId = songId;
		try {
			await removeSongFromPlaylist(data.playlist.id, songId);
			data.playlist.songs = data.playlist.songs.filter((s) => s.id !== songId);
		} catch (error) {
			console.error('Failed to remove song:', error);
		} finally {
			deletingSongId = null;
		}
	}

	// Handle keyboard events for editing
	function handleTitleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			saveTitle();
		} else if (event.key === 'Escape') {
			editTitle = data.playlist.title;
			isEditingTitle = false;
		}
	}

	function handleDescriptionKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			saveDescription();
		} else if (event.key === 'Escape') {
			editDescription = data.playlist.description || '';
			isEditingDescription = false;
		}
	}
</script>

<div class="flex flex-col">
	<!-- Playlist Header -->
	<div
		class="relative overflow-hidden bg-gradient-to-b from-purple-900/80 via-purple-800/40 to-background p-6 md:p-8"
	>
		<div class="flex flex-col items-start gap-6 md:flex-row md:items-end">
			<!-- Playlist Cover -->
			<div
				class="flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-blue-500 shadow-2xl md:h-56 md:w-56"
			>
				<MusicIcon class="h-20 w-20 text-white/80 md:h-28 md:w-28" />
			</div>

			<!-- Playlist Info -->
			<div class="flex min-w-0 flex-1 flex-col gap-2">
				<span class="text-xs font-semibold tracking-wider text-white/80 uppercase">Playlist</span>

				<!-- Editable Title -->
				{#if isEditingTitle}
					<Input
						type="text"
						bind:value={editTitle}
						onblur={saveTitle}
						onkeydown={handleTitleKeydown}
						class="h-auto border-none bg-transparent p-0 text-3xl font-bold focus-visible:ring-0 md:text-5xl"
						disabled={isSaving}
						autofocus
					/>
				{:else}
					<button
						onclick={() => {
							isEditingTitle = true;
						}}
						class="text-left text-3xl font-bold text-white decoration-2 underline-offset-4 hover:underline md:text-5xl"
					>
						{data.playlist.title}
					</button>
				{/if}

				<!-- Editable Description -->
				{#if isEditingDescription}
					<Input
						type="text"
						bind:value={editDescription}
						onblur={saveDescription}
						onkeydown={handleDescriptionKeydown}
						placeholder="Add a description..."
						class="h-auto border-none bg-transparent p-0 text-sm text-white/80 focus-visible:ring-0"
						disabled={isSaving}
						autofocus
					/>
				{:else}
					<button
						onclick={() => {
							isEditingDescription = true;
						}}
						class="text-left text-sm text-white/80 hover:underline"
					>
						{data.playlist.description || 'Click to add a description...'}
					</button>
				{/if}

				<!-- Metadata -->
				<div class="mt-2 flex items-center gap-2 text-sm text-white/60">
					<span>{data.playlist.songs?.length || 0} songs</span>
					<span>•</span>
					<span>Created {formatDate(data.playlist.created_at)}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Action Buttons -->
	<div class="flex items-center gap-4 p-6">
		<Button variant="outline" onclick={() => goto('/search')}>
			<SearchIcon class="mr-2 h-4 w-4" />
			Find songs
		</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} size="icon" variant="ghost" class="h-10 w-10">
						<MoreHorizontalIcon class="h-5 w-5" />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item
					onclick={() => {
						isEditingTitle = true;
					}}
				>
					<PencilIcon class="mr-2 h-4 w-4" />
					Edit title
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onclick={handleDeletePlaylist}
					class="text-destructive"
					disabled={isDeleting}
				>
					<TrashIcon class="mr-2 h-4 w-4" />
					{isDeleting ? 'Deleting...' : 'Delete playlist'}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>

	<Separator />

	<!-- Songs Table -->
	<div class="p-6">
		{#if data.playlist.songs && data.playlist.songs.length > 0}
			<!-- Table Header -->
			<div
				class="grid grid-cols-[2rem_1fr_8rem_3rem] gap-4 px-4 py-2 text-xs font-medium tracking-wider text-muted-foreground uppercase"
			>
				<span>#</span>
				<span>Title</span>
				<span>Date Added</span>
				<span></span>
			</div>
			<Separator class="my-2" />

			<!-- Songs List -->
			{#each data.playlist.songs as song, index (song.id)}
				<div
					class="group grid grid-cols-[2rem_1fr_8rem_3rem] items-center gap-4 rounded-md px-4 py-3 hover:bg-accent/50"
				>
					<span class="text-sm text-muted-foreground">{index + 1}</span>
					<div class="flex min-w-0 flex-col">
						<span class="truncate font-medium">{song.song_title}</span>
						<span class="truncate text-sm text-muted-foreground">{song.song_artist}</span>
					</div>
					<span class="text-sm text-muted-foreground">{formatDate(song.created_at)}</span>
					<Button
						size="icon"
						variant="ghost"
						class="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
						onclick={() => handleRemoveSong(song.id)}
						disabled={deletingSongId === song.id}
					>
						{#if deletingSongId === song.id}
							<span class="animate-spin">...</span>
						{:else}
							<TrashIcon class="h-4 w-4 text-muted-foreground hover:text-destructive" />
						{/if}
					</Button>
				</div>
			{/each}
		{:else}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<MusicIcon class="mb-4 h-16 w-16 text-muted-foreground" />
				<h3 class="mb-2 text-xl font-semibold">No songs in this playlist</h3>
				<p class="mb-4 text-muted-foreground">Start adding songs from the search page</p>
				<Button onclick={() => goto('/search')}>Find songs</Button>
			</div>
		{/if}
	</div>
</div>
