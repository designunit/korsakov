declare module "react-full-screen" {
    export interface FullScreenHandle {
        active: boolean;
        enter: () => Promise<void>;
        exit: () => Promise<void>;
        node: React.MutableRefObject<HTMLDivElement | null>;
    }

    export interface FullScreenProps {
        handle: FullScreenHandle;
        onChange?: (state: boolean, handle: FullScreenHandle) => void;
        className?: string;
        children?: React.ReactNode
    }

    export declare function useFullScreenHandle(): FullScreenHandle;
    export declare const FullScreen: React.FC<FullScreenProps>
}
