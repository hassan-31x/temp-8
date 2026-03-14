import {
  AlignFeature,
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ParagraphFeature,
  IndentFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
  UploadFeature
} from '@payloadcms/richtext-lexical'
import { Banner } from '@/blocks/Banner/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import type { Field } from 'payload'

const colorOptions = [
  { label: 'White', value: 'white' },
  { label: 'Slate', value: 'slate' },
  { label: 'Green', value: 'green' },
]

export const privacy: Field[] = []