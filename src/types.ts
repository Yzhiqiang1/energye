import { FC, SVGProps } from 'react';
import { SvgXml } from 'react-native-svg';

// 定义一个通用的图标组件类型
export type IconComponent = FC<SVGProps<SVGSVGElement>>;

// 定义 iconMap 的类型
export type IconMap = Record<string, IconComponent>;