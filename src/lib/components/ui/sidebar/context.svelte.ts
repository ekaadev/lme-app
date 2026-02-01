import { IsMobile } from '$lib/hooks/is-mobile.svelte.js';
import { getContext, setContext } from 'svelte';
import { SIDEBAR_KEYBOARD_SHORTCUT } from './constants.js';

type Getter<T> = () => T;

export type SidebarStateProps = {
	/**
	 * A getter function that returns the current open state of the sidebar.
	 * We use a getter function here to support `bind:open` on the `Sidebar.Provider`
	 * component.
	 */
	open: Getter<boolean>;

	/**
	 * A function that sets the open state of the sidebar. To support `bind:open`, we need
	 * a source of truth for changing the open state to ensure it will be synced throughout
	 * the sub-components and any `bind:` references.
	 */
	setOpen: (open: boolean) => void;

	/**
	 * Unique identifier for the sidebar instance. Used to support multiple independent sidebars.
	 */
	id?: string;

	/**
	 * Keyboard shortcut key for toggling the sidebar. Defaults to 'b'.
	 */
	shortcutKey?: string;
};

class SidebarState {
	readonly props: SidebarStateProps;
	open = $derived.by(() => this.props.open());
	openMobile = $state(false);
	setOpen: SidebarStateProps['setOpen'];
	#isMobile: IsMobile;
	state = $derived.by(() => (this.open ? 'expanded' : 'collapsed'));
	id: string;
	shortcutKey: string;

	constructor(props: SidebarStateProps) {
		this.setOpen = props.setOpen;
		this.#isMobile = new IsMobile();
		this.props = props;
		this.id = props.id || 'default';
		this.shortcutKey = props.shortcutKey || SIDEBAR_KEYBOARD_SHORTCUT;
	}

	// Convenience getter for checking if the sidebar is mobile
	// without this, we would need to use `sidebar.isMobile.current` everywhere
	get isMobile() {
		return this.#isMobile.current;
	}

	// Event handler to apply to the `<svelte:window>`
	handleShortcutKeydown = (e: KeyboardEvent) => {
		if (e.key === this.shortcutKey && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
			e.preventDefault();
			this.toggle();
		}
	};

	setOpenMobile = (value: boolean) => {
		this.openMobile = value;
	};

	toggle = () => {
		return this.#isMobile.current ? (this.openMobile = !this.openMobile) : this.setOpen(!this.open);
	};
}

const SYMBOL_KEY = 'scn-sidebar';

/**
 * Instantiates a new `SidebarState` instance and sets it in the context.
 *
 * @param props The constructor props for the `SidebarState` class.
 * @returns  The `SidebarState` instance.
 */
export function setSidebar(props: SidebarStateProps): SidebarState {
	const key = props.id ? `${SYMBOL_KEY}-${props.id}` : SYMBOL_KEY;
	return setContext(Symbol.for(key), new SidebarState(props));
}

/**
 * Retrieves the `SidebarState` instance from the context. This is a class instance,
 * so you cannot destructure it.
 * @param id Optional sidebar identifier to retrieve a specific sidebar instance.
 * @returns The `SidebarState` instance.
 */
export function useSidebar(id?: string): SidebarState {
	const key = id ? `${SYMBOL_KEY}-${id}` : SYMBOL_KEY;
	return getContext(Symbol.for(key));
}
