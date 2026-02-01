<script lang="ts" module>
	const availableSongs = [
		{
			id: '1',
			title: 'Dan',
			artist: 'Sheila On 7',
			album: 'OST. Petualangan Sherina',
			imageUrl: ''
		},
		{
			id: '2',
			title: 'Menghitung Hari',
			artist: 'Krisdayanti',
			album: 'Cinta',
			imageUrl: ''
		},
		{
			id: '3',
			title: 'Laskar Pelangi',
			artist: 'Nidji',
			album: 'OST. Laskar Pelangi',
			imageUrl: ''
		},
		{
			id: '4',
			title: 'Separuh Nafas',
			artist: 'Dewa 19',
			album: 'Bintang Lima',
			imageUrl: ''
		},
		{
			id: '5',
			title: 'Sempurna',
			artist: 'Andra and The Backbone',
			album: 'Sempurna',
			imageUrl: ''
		}
	];
</script>

<script lang="ts">
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as Sidebar from '@/components/ui/sidebar/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import type { ComponentProps } from 'svelte';

	import SearchIcon from '@lucide/svelte/icons/search';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import MusicIcon from '@lucide/svelte/icons/music';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();

	let searchQuery = $state('');

	let filteredSongs = $derived(
		searchQuery
			? availableSongs.filter(
					(song) =>
						song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						song.artist.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: availableSongs
	);

	function addSongToContent(songId: string) {
		window.dispatchEvent(
			new CustomEvent('add-song', {
				detail: availableSongs.find((s) => s.id === songId)
			})
		);
	}
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header class="space-y-2 p-4">
		<h2 class="text-lg font-semibold">Cari lagu</h2>
		<p class="text-sm text-muted-foreground">Lagu apa yang sedang kamu cari?</p>
		<InputGroup.Root>
			<InputGroup.Input bind:value={searchQuery} placeholder="Cari judul atau artis..." />
			<InputGroup.Addon>
				<SearchIcon class="size-4" />
			</InputGroup.Addon>
		</InputGroup.Root>
	</Sidebar.Header>
	<Sidebar.Content>
		<div class="space-y-2 p-2">
			{#each filteredSongs as song (song.id)}
				<div
					class="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
				>
					{#if song.imageUrl}
						<img src={song.imageUrl} alt={song.title} class="h-12 w-12 rounded-md object-cover" />
					{:else}
						<div
							class="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary"
						>
							<MusicIcon class="size-5" />
						</div>
					{/if}

					<div class="flex-1 overflow-hidden">
						<p class="truncate text-sm font-medium">{song.title}</p>
						<p class="truncate text-xs text-muted-foreground">{song.artist}</p>
					</div>

					<Button
						size="icon"
						variant="ghost"
						class="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
						onclick={() => addSongToContent(song.id)}
					>
						<PlusIcon class="size-4" />
					</Button>
				</div>
			{/each}

			{#if filteredSongs.length === 0}
				<div class="py-8 text-center text-sm text-muted-foreground">
					<MusicIcon class="mx-auto mb-2 size-8 opacity-50" />
					<p>Tidak ada lagu ditemukan</p>
				</div>
			{/if}
		</div>
	</Sidebar.Content>
</Sidebar.Root>
