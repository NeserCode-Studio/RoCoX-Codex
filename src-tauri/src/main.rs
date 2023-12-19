// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use tauri::Manager;

#[tauri::command]
fn use_devtools(app_handle: tauri::AppHandle) {
    let window = app_handle.get_window("main").unwrap();
    window.close_devtools();
    window.open_devtools();
}

fn main() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![use_devtools])
        .run(context)
        .expect("error while running application");
}
