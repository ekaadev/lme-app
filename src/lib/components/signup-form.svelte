<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { ComponentProps } from 'svelte';
	import { register } from '$lib/api/auth';

	let { ...restProps }: ComponentProps<typeof Card.Root> = $props();

	// Form state menggunakan Svelte 5 runes
	let username = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	// Handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		errorMessage = '';
		successMessage = '';

		// Validasi password match
		if (password !== confirmPassword) {
			errorMessage = 'Password tidak cocok. Silakan periksa kembali.';
			return;
		}

		// Validasi password length
		if (password.length < 8) {
			errorMessage = 'Password minimal 8 karakter.';
			return;
		}

		isLoading = true;

		try {
			await register({ username, email, password });

			// Tampilkan success message
			successMessage = 'Registrasi berhasil! Silakan login.';

			// Redirect ke halaman login setelah 2 detik
			setTimeout(() => {
				goto('/login');
			}, 2000);
		} catch (error) {
			// Tampilkan error message
			if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = 'Registrasi gagal. Silakan coba lagi.';
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<Card.Root {...restProps}>
	<Card.Header>
		<Card.Title>Create an account</Card.Title>
		<Card.Description>Enter your information below to create your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form onsubmit={handleSubmit}>
			<Field.Group>
				<!-- Success message display -->
				{#if successMessage}
					<div class="rounded-md bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400">
						{successMessage}
					</div>
				{/if}

				<!-- Error message display -->
				{#if errorMessage}
					<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
						{errorMessage}
					</div>
				{/if}

				<Field.Field>
					<Field.Label for="username">Username</Field.Label>
					<Input
						id="username"
						type="text"
						placeholder="johndoe"
						bind:value={username}
						required
						disabled={isLoading}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="email">Email</Field.Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						bind:value={email}
						required
						disabled={isLoading}
					/>
					<Field.Description>
						We'll use this to contact you. We will not share your email with anyone else.
					</Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="password">Password</Field.Label>
					<Input
						id="password"
						type="password"
						bind:value={password}
						required
						disabled={isLoading}
					/>
					<Field.Description>Must be at least 8 characters long.</Field.Description>
				</Field.Field>
				<Field.Field>
					<Field.Label for="confirm-password">Confirm Password</Field.Label>
					<Input
						id="confirm-password"
						type="password"
						bind:value={confirmPassword}
						required
						disabled={isLoading}
					/>
					<Field.Description>Please confirm your password.</Field.Description>
				</Field.Field>
				<Field.Group>
					<Field.Field>
						<Button type="submit" disabled={isLoading}>
							{#if isLoading}
								Loading...
							{:else}
								Create Account
							{/if}
						</Button>
						<Field.Description class="px-6 text-center">
							Already have an account? <a href="/login" class="underline">Sign in</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</Field.Group>
		</form>
	</Card.Content>
</Card.Root>
