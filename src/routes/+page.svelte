<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	// Icons
	import CommandIcon from '@lucide/svelte/icons/command';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import HeartIcon from '@lucide/svelte/icons/heart';
	import ListMusicIcon from '@lucide/svelte/icons/list-music';
	import MusicIcon from '@lucide/svelte/icons/music';
</script>

<!-- Landing Page -->
<div class="min-h-screen bg-background">
	<!-- Header/Navbar -->
	<header
		class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
	>
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2">
				<div
					class="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"
				>
					<CommandIcon class="size-4" />
				</div>
				<span class="text-xl font-bold">Harmoni</span>
			</a>

			<!-- Navigation -->
			<nav class="flex items-center gap-2">
				<Button variant="ghost" href="/login">Masuk</Button>
				<Button href="/signup">Daftar</Button>
			</nav>
		</div>
	</header>

	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-24 text-center md:py-32">
		<!-- Badge -->
		<Badge variant="secondary" class="mb-6 gap-1.5 px-3 py-1.5">
			<SparklesIcon class="size-3.5" />
			<span>AI-Powered</span>
		</Badge>

		<!-- Title -->
		<h1 class="mx-auto max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
			Pahami Makna di Balik
			<span class="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
				Lirik Lagu
			</span>
		</h1>

		<!-- Description -->
		<p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
			Lirik lagu bukan sekadar kata-kata. Temukan emosi dan makna tersembunyi di balik lagu
			favoritmu dengan bantuan AI.
		</p>

		<!-- CTA Buttons -->
		<div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
			<Button size="lg" href="/signup" class="w-full gap-2 sm:w-auto">
				<SparklesIcon class="size-4" />
				Mulai Sekarang
			</Button>
			<Button size="lg" variant="outline" href="/login" class="w-full sm:w-auto">Masuk</Button>
		</div>
	</section>

	<Separator />

	<!-- Features Section -->
	<section class="container mx-auto px-4 py-20">
		<div class="mb-12 text-center">
			<h2 class="text-3xl font-bold">Fitur Utama</h2>
			<p class="mt-3 text-muted-foreground">Jelajahi kemampuan Harmoni</p>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			<!-- Feature 1: Analisis Emosi -->
			<Card.Root class="border-2 transition-colors hover:border-primary/50">
				<Card.Header>
					<div class="mb-2 flex size-12 items-center justify-center rounded-lg bg-pink-500/10">
						<HeartIcon class="size-6 text-pink-500" />
					</div>
					<Card.Title>Analisis Emosi</Card.Title>
					<Card.Description>
						Deteksi emosi yang terkandung dalam lirik lagu menggunakan model AI
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<!-- Feature 2: Interpretasi Lirik -->
			<Card.Root class="border-2 transition-colors hover:border-primary/50">
				<Card.Header>
					<div class="mb-2 flex size-12 items-center justify-center rounded-lg bg-purple-500/10">
						<MusicIcon class="size-6 text-purple-500" />
					</div>
					<Card.Title>Interpretasi Lirik</Card.Title>
					<Card.Description>
						Dapatkan penjelasan mendalam tentang makna lirik dan metafora yang digunakan
					</Card.Description>
				</Card.Header>
			</Card.Root>

			<!-- Feature 3: Simpan Playlist -->
			<Card.Root class="border-2 transition-colors hover:border-primary/50">
				<Card.Header>
					<div class="mb-2 flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
						<ListMusicIcon class="size-6 text-blue-500" />
					</div>
					<Card.Title>Simpan Playlist</Card.Title>
					<Card.Description>
						Organisir lagu-lagu favoritmu dalam playlist untuk dianalisis kapan saja
					</Card.Description>
				</Card.Header>
			</Card.Root>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t py-8">
		<div class="container mx-auto px-4 text-center text-sm text-muted-foreground">
			<p>© 2026 Harmoni. All rights reserved.</p>
		</div>
	</footer>
</div>
