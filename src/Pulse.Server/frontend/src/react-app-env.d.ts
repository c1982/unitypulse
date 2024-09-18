/// <reference types="react-scripts" />

declare module 'react-dom/client' {
    import { RenderOptions, Root } from 'react-dom';

    export function createRoot(container: Element | DocumentFragment): Root;
    export function hydrateRoot(
        container: Element | DocumentFragment,
        children: React.ReactNode,
        options?: RenderOptions,
    ): Root;
}
