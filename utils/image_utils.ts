import sharp from 'sharp'
import { createAvatar } from '@dicebear/core'
import { lorelei, glass } from '@dicebear/collection'

/**
 * Generates a random avatar for the user
 *
 * @param {string} seed - seed for generating the avatar e.g. John Doe
 * @returns {Promise<string>} - Promise which resolves with a string
 * */
export const generateAvatar = async (seed: string): Promise<string> => {
  const avatar = createAvatar(lorelei, {
    scale: 100,
    size: 96,
    backgroundType: ['gradientLinear', 'solid'],
    seed,
  }).toDataUri()

  return avatar
}

/**
 * Generates a random avatar for the group.
 *
 * @param {string} seed - seed for generating the avatar e.g. John Doe
 * @returns {Promise<string>} - Promise which resolves with a string
 * */
export const generateAvatarForGroups = async (
  seed: string
): Promise<string> => {
  const avatar = createAvatar(glass, {
    scale: 100,
    size: 96,
    seed,
  }).toDataUri()

  return avatar
}

/**
 * Generates a Thumbnail for the image file
 *
 * @param {Buffer} buffer - Image file buffer
 * @returns {Buffer} - thumbnail image file as a buffer
 * */
export const generateThumbnail = async (buffer: Buffer): Promise<Buffer> => {
  const { width, height } = await sharp(buffer).metadata()

  if (width == undefined || height == undefined) {
    const thumbnailBuffer = await sharp(buffer)
      .resize(200, 200)
      .png()
      .toBuffer()

    return thumbnailBuffer
  }

  const aspectRatio = height / width
  const thumbnailWidth = 500
  const thumbnailHeight = Math.floor(aspectRatio * thumbnailWidth)

  const thumbnailBuffer = await sharp(buffer)
    .resize(thumbnailWidth, thumbnailHeight)
    .png()
    .toBuffer()

  return thumbnailBuffer
}

/**
 * Converts the image to png file
 *
 * @param {Buffer} buffer - Image file buffer
 * @returns {Buffer} - png image file buffer
 * */
export const convertToPng = async (buffer: Buffer): Promise<Buffer> => {
  const png = await sharp(buffer).png().toBuffer()

  return png
}

/**
 * Converts the input file to thumbnail buffer and original buffer in png
 *
 * @param {File} file - Input image file in any format
 * @returns {Promise<{thumbnail: Buffer, original: Buffer}>} - Promise which resolves with an object containing thumbnail buffer and converted image buffer in png
 * */
export const processImage = async (
  file: File
): Promise<{ thumbnail: Buffer; original: Buffer }> => {
  const buffer = Buffer.from(await file.arrayBuffer())
  const thumbnail = await generateThumbnail(buffer)

  let original_file_buffer = buffer

  if (!file.type.match('image/png'))
    original_file_buffer = await convertToPng(buffer)

  return { thumbnail, original: original_file_buffer }
}
