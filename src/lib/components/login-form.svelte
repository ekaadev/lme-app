<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { login } from '$lib/api/auth';
	import { authStore } from '$lib/stores/auth.svelte';

	const id = $props.id();

	// Form state menggunakan Svelte 5 runes
	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');

	// Handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';
		isLoading = true;

		try {
			const response = await login({ email, password });

			// Set user data ke store
			authStore.setUser(response.user);

			// Redirect ke halaman utama setelah login berhasil
			await goto('/new');
		} catch (error) {
			// Tampilkan error message
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = 'Login gagal. Silakan coba lagi.';
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={handleSubmit}>
			<FieldGroup>
				<!-- Error message display -->
				{#if errorMessage}
					<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
						{errorMessage}
					</div>
				{/if}

				<Field>
					<FieldLabel for="email-{id}">Email</FieldLabel>
					<Input
						id="email-{id}"
						type="email"
						placeholder="m@example.com"
						bind:value={email}
						required
						disabled={isLoading}
					/>
				</Field>
				<Field>
					<FieldLabel for="password-{id}">Password</FieldLabel>
					<Input
						id="password-{id}"
						type="password"
						bind:value={password}
						required
						disabled={isLoading}
					/>
				</Field>
				<Field>
					<Button type="submit" class="w-full" disabled={isLoading}>
						{#if isLoading}
							Loading...
						{:else}
							Login
						{/if}
					</Button>
					<FieldDescription class="text-center">
						Don't have an account? <a href="/signup" class="underline">Sign up</a>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
