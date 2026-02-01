<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import HistoryIcon from '@lucide/svelte/icons/history';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { logout } from '$lib/api/auth';
	import { authStore } from '$lib/stores/auth.svelte';

	let {
		user
	}: {
		user: {
			name: string;
			email: string;
			avatar: string;
		};
	} = $props();

	const sidebar = useSidebar();

	// State untuk loading saat logout
	let isLoggingOut = $state(false);

	// Handle logout
	async function handleLogout() {
		isLoggingOut = true;
		try {
			await logout();

			// Clear auth store
			authStore.clear();

			// Invalidate semua data dan redirect ke login
			await invalidateAll();
			await goto('/login');
		} catch (error) {
			console.error('Logout failed:', error);
			// Tetap redirect ke login meski gagal
			await goto('/login');
		} finally {
			isLoggingOut = false;
		}
	}

	// Ambil inisial dari nama user untuk avatar fallback
	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((word) => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">{getInitials(user.name)}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
						</div>
						<ChevronsUpDownIcon class="ms-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side="bottom"
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">{getInitials(user.name)}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-start text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<a href="/history" class="flex w-full items-center gap-2">
						<HistoryIcon />
						History
					</a>
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item onclick={handleLogout} disabled={isLoggingOut}>
					<LogOutIcon />
					{#if isLoggingOut}
						Logging out...
					{:else}
						Log out
					{/if}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
