import EarthModule from '../modules/Earth/EarthModule.jsx';
import MarsPage from './mars/MarsPage.jsx';
import { MoonModule } from '../moon/index.js';

export const PLANETS = [
  { id: 'earth', label: 'Earth', component: EarthModule },
  { id: 'mars', label: 'Mars', component: MarsPage },
  { id: 'moon', label: 'Moon', component: MoonModule },
];

export { EarthModule as EarthPage, MarsPage, MoonModule as MoonPage };
