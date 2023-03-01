use js_sys::Uint8Array;
use std::io::{Cursor, Write};
use wasm_bindgen::prelude::*;

#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn to_ico(width: u32, height: u32, pixels: Uint8Array) -> Uint8Array {
    let bmp_height = height * 2; // Double height for XOR and AND masks
    let bmp_image_size = bmp_height * width * 4;
    let bmp_size = BMP_INFO_HEADER_SIZE + bmp_image_size as usize;

    let pixels = pixels.to_vec();

    let buffer_size = ICO_HEADER_SIZE + ICO_DIR_ENTRY_SIZE + bmp_size;
    let mut buffer = vec![0; buffer_size];
    let mut cursor = Cursor::new(&mut buffer);

    // ICO header
    cursor.write_all(&0u16.to_le_bytes()).unwrap(); // Reserved
    cursor.write_all(&1u16.to_le_bytes()).unwrap(); // Type: 1 = ICO
    cursor.write_all(&1u16.to_le_bytes()).unwrap(); // Number of images

    // ICO directory entry
    cursor.write_all(&[width as u8]).unwrap(); // Image width
    cursor.write_all(&[height as u8]).unwrap(); // Image height
    cursor.write_all(&[0]).unwrap(); // Number of colors in palette
    cursor.write_all(&[0]).unwrap(); // Reserved
    cursor.write_all(&0u16.to_le_bytes()).unwrap(); // Color planes
    cursor.write_all(&32u16.to_le_bytes()).unwrap(); // Bits per pixel
    cursor.write_all(&(bmp_size as u32).to_le_bytes()).unwrap(); // Size of image data
    cursor
        .write_all(&(ICO_HEADER_SIZE + ICO_DIR_ENTRY_SIZE).to_le_bytes())
        .unwrap(); // Offset of BMP data

    // BMP info header
    cursor.write_all(&[40, 0, 0, 0]).unwrap(); // Size of this header
    cursor.write_all(&width.to_le_bytes()).unwrap(); // Image width
    cursor.write_all(&bmp_height.to_le_bytes()).unwrap(); // Image height
    cursor.write_all(&1u16.to_le_bytes()).unwrap(); // Number of color planes
    cursor.write_all(&32u16.to_le_bytes()).unwrap(); // Bits per pixel
    cursor.write_all(&0u32.to_le_bytes()).unwrap(); // Compression method
    cursor.write_all(&bmp_image_size.to_le_bytes()).unwrap(); // Image size
    cursor.write_all(&0u32.to_le_bytes()).unwrap(); // Horizontal resolution
    cursor.write_all(&0u32.to_le_bytes()).unwrap(); // Vertical resolution
    cursor.write_all(&0u32.to_le_bytes()).unwrap(); // Number of colors in palette
    cursor.write_all(&0u32.to_le_bytes()).unwrap(); // Number of important colors

    // BMP data
    pixels
        .chunks_exact(width as usize * 4)
        .rev()
        .for_each(|row| {
            row.chunks_exact(4).for_each(|pixel| {
                let r = pixel[0];
                let g = pixel[1];
                let b = pixel[2];
                let a = pixel[3];

                cursor.write_all(&[b, g, r, a]).unwrap();
            });
        });

    Uint8Array::from(buffer.as_slice())
}

const ICO_HEADER_SIZE: usize = 6;
const ICO_DIR_ENTRY_SIZE: usize = 16;
const BMP_INFO_HEADER_SIZE: usize = 40;
