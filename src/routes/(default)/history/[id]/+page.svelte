<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import MusicIcon from '@lucide/svelte/icons/music';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import SmileIcon from '@lucide/svelte/icons/smile';
	import FrownIcon from '@lucide/svelte/icons/frown';
	import MehIcon from '@lucide/svelte/icons/meh';
	import { deleteHistory } from '$lib/api/history';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isDeleting = $state(false);

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('id-ID', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getEmotionIcon(emotion: string) {
		const lowerEmotion = emotion.toLowerCase();
		if (lowerEmotion.includes('happy') || lowerEmotion.includes('joy')) return SmileIcon;
		if (lowerEmotion.includes('sad') || lowerEmotion.includes('grief')) return FrownIcon;
		if (lowerEmotion.includes('love') || lowerEmotion.includes('romantic')) return HeartIcon;
		return MehIcon;
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

	async function handleDelete() {
		if (!confirm('Hapus riwayat ini?')) return;

		isDeleting = true;
		try {
			await deleteHistory(data.history.id);
			await goto('/history');
		} catch (error) {
			console.error('Failed to delete:', error);
		} finally {
			isDeleting = false;
		}
	}
</script>

<div class="flex flex-col">
	<!-- Header -->
	<div
		class="relative overflow-hidden bg-gradient-to-b from-purple-900/80 via-purple-800/40 to-background p-6 md:p-8"
	>
		<div class="flex flex-col items-start gap-6 md:flex-row md:items-end">
			<!-- Music Icon -->
			<div
				class="flex h-40 w-40 flex-shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-600 to-blue-500 shadow-2xl md:h-56 md:w-56"
			>
				<MusicIcon class="h-20 w-20 text-white/80 md:h-28 md:w-28" />
			</div>

			<!-- Song Info -->
			<div class="flex min-w-0 flex-1 flex-col gap-2">
				<span class="text-xs font-semibold tracking-wider text-white/80 uppercase">History</span>
				<h1 class="text-3xl font-bold text-white md:text-5xl">{data.history.song_title}</h1>
				<p class="text-lg text-white/80">{data.history.song_artist}</p>

				<div class="mt-2 flex items-center gap-3 text-sm text-white/60">
					{#if data.history.emotion}
						{@const EmotionIcon = getEmotionIcon(data.history.emotion)}
						<Badge class={getEmotionColor(data.history.emotion)}>
							<EmotionIcon class="mr-1 size-3" />
							{data.history.emotion}
						</Badge>
					{/if}
					<span>{formatDate(data.history.created_at)}</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Actions -->
	<div class="flex items-center gap-4 p-6">
		<Button variant="outline" onclick={() => goto('/history')}>
			<ArrowLeftIcon class="mr-2 h-4 w-4" />
			Kembali
		</Button>
		<Button variant="destructive" onclick={handleDelete} disabled={isDeleting}>
			<TrashIcon class="mr-2 h-4 w-4" />
			{isDeleting ? 'Menghapus...' : 'Hapus'}
		</Button>
	</div>

	<Separator />

	<!-- Interpretation -->
	<div class="p-6">
		<div class="mx-auto max-w-4xl space-y-6">
			{#if data.history.interpretation}
				<div class="space-y-2">
					<h2 class="text-lg font-semibold text-primary">Interpretasi</h2>
					<div class="prose prose-sm dark:prose-invert max-w-none">
						{@html data.history.interpretation
							.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
							.replace(/\n/g, '<br>')}
					</div>
				</div>
			{:else}
				<div class="py-8 text-center text-muted-foreground">
					<p>Tidak ada interpretasi tersedia</p>
				</div>
			{/if}
		</div>
	</div>
</div>
