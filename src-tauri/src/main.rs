// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .run(context)
        .expect("error while running application");
}
