import { Caravan } from './caravan'
import { FighterJet } from './fighter-jet'
import { Pram } from './pram'
import { ShoppingCart } from './shopping-cart'
import { Truck } from './truck'

export interface IconItem {
  label: string
  value: string
  svg: React.FC
}

export const ICONS: IconItem[] = [
  {
    label: 'Caravan',
    value: 'CARAVAN',
    svg: Caravan,
  },
  {
    label: 'Fighter Jet',
    value: 'FIGHTER_JET',
    svg: FighterJet,
  },
  {
    label: 'Pram',
    value: 'PRAM',
    svg: Pram,
  },
  {
    label: 'Shopping Cart',
    value: 'SHOPPING_CART',
    svg: ShoppingCart,
  },
  {
    label: 'Truck',
    value: 'TRUCK',
    svg: Truck,
  },
]
