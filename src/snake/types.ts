export interface SegmentMetadata {
  id: string;
}

export const CollisionGroup = {
  SNAKE: 0b0001,
  GROUND: 0b0010,
} as const;
