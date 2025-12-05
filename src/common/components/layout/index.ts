// Base layouts (순수 레이아웃 컴포넌트)
export { default as Top1Body10 } from './Top1Body10';
export { default as Top1Body10Bottom1 } from './Top1Body10Bottom1';
export { default as Top4Body10 } from './Top4Body10';

// Screen layout (기능 레이아웃)
export { ScreenLayout } from './ScreenLayout';
export type { ScreenLayoutProps } from './ScreenLayout';

// Pre-composed layouts (ScreenLayout + Base layouts)
export { Top1Body10Layout } from './Top1Body10Layout';
export { Top1Body10Bottom1Layout } from './Top1Body10Bottom1Layout';
export { Top4Body10Layout } from './Top4Body10Layout';
