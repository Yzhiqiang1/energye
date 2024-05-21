import type { NativeSyntheticEvent } from 'react-native';
import type { ErrorWithCause } from './CameraError';
import type { CameraProps, OnShutterEvent } from './types/CameraProps';
import type { Code, CodeScanner, CodeScannerFrame } from './types/CodeScanner';
export interface OnCodeScannedEvent {
    codes: Code[];
    frame: CodeScannerFrame;
}
export interface OnErrorEvent {
    code: string;
    message: string;
    cause?: ErrorWithCause;
}
export interface AverageFpsChangedEvent {
    averageFps: number;
}
export type NativeCameraViewProps = Omit<CameraProps, 'device' | 'onInitialized' | 'onError' | 'onShutter' | 'frameProcessor' | 'codeScanner'> & {
    cameraId: string;
    enableFrameProcessor: boolean;
    codeScannerOptions?: Omit<CodeScanner, 'onCodeScanned'>;
    onViewReady: (event: NativeSyntheticEvent<void>) => void;
    onAverageFpsChanged?: (event: NativeSyntheticEvent<AverageFpsChangedEvent>) => void;
    onInitialized?: (event: NativeSyntheticEvent<void>) => void;
    onError?: (event: NativeSyntheticEvent<OnErrorEvent>) => void;
    onCodeScanned?: (event: NativeSyntheticEvent<OnCodeScannedEvent>) => void;
    onStarted?: (event: NativeSyntheticEvent<void>) => void;
    onStopped?: (event: NativeSyntheticEvent<void>) => void;
    onShutter?: (event: NativeSyntheticEvent<OnShutterEvent>) => void;
};
export declare const NativeCameraView: import("react-native").HostComponent<NativeCameraViewProps>;
//# sourceMappingURL=NativeCameraView.d.ts.map