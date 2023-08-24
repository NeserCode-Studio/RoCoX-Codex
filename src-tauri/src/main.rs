// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// use windows_webview2::Microsoft::Web::WebView2::Core;

use tauri::Manager;
use webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2WebResourceRequest;
use webview2_com::Microsoft::Web::WebView2::Win32::COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL;
use webview2_com::WebResourceRequestedEventHandler;
// use windows_webview2::Windows::Foundation::EventRegistrationToken;
use windows::core::PCWSTR;
use windows::Win32::System::WinRT::EventRegistrationToken;

fn str_to_pcwstr(s: &str) -> Vec<u16> {
    let result = s
        .to_string()
        .encode_utf16()
        .chain(std::iter::once(0))
        .collect();
    result
}

fn main() {
    let context = tauri::generate_context!();

    tauri::Builder::default()
        .setup(|app| {
            let win = app.get_window("main").unwrap();

            let _ = win.with_webview(|webview| unsafe {
                let core = webview.controller().CoreWebView2().unwrap();
                let mut _token = EventRegistrationToken::default();

                let _ = core.AddWebResourceRequestedFilter(
                    PCWSTR::from_raw(str_to_pcwstr("*").as_ptr()),
                    COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL,
                );
                let _ = core.add_WebResourceRequested(
                    &WebResourceRequestedEventHandler::create(Box::new(move |_webview, args| {
                        if let Some(args) = args {
                            let request: ICoreWebView2WebResourceRequest = args.Request().unwrap(); // manual type to make Rust-Analyzer show the types
                            request
                                .Headers()
                                .unwrap()
                                .SetHeader(
                                    // Origin
                                    PCWSTR::from_raw(str_to_pcwstr("referrer").as_ptr()),
                                    PCWSTR::from_raw(
                                        str_to_pcwstr("https://rocotime.com").as_ptr(),
                                    ),
                                )
                                .unwrap();
                        }
                        Ok(())
                    })),
                    &mut _token,
                );
            });

            Ok(().into())
        })
        .run(context)
        .expect("error while running application");
}
