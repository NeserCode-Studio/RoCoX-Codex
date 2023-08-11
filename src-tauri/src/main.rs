// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// use windows_webview2::Microsoft::Web::WebView2::Core

// use webview2_com::Microsoft::Web::WebView2::Win32::ICoreWebView2WebResourceRequest;
// use webview2_com::Microsoft::Web::WebView2::Win32::COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL;
// use webview2_com::WebResourceRequestedEventHandler;
// use windows_webview2::Windows::Foundation::EventRegistrationToken;

fn main() {
    let context = tauri::generate_context!();
    tauri::Builder::default()
        .run(context)
        .expect("error while running application");

    // let win = app.get_window("main").unwrap();
    // win.with_webview(|webview| unsafe {
    //     let core = webview.controller().CoreWebView2().unwrap();
    //     let mut _token = EventRegistrationToken::default();
    //     // You'd probably use CONTEXT_WEBSOCKET or whatever fits, see https://docs.microsoft.com/en-us/dotnet/api/microsoft.web.webview2.core.corewebview2webresourcecontext?view=webview2-dotnet-1.0.1293.44
    //     // Also use a fitting glob filter, so that it doesn't trigger for all requests, see https://docs.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2?view=webview2-1.0.1293.44#addwebresourcerequestedfilter
    //     core.AddWebResourceRequestedFilter("*", COREWEBVIEW2_WEB_RESOURCE_CONTEXT_ALL);
    //     core.add_WebResourceRequested(
    //         WebResourceRequestedEventHandler::create(Box::new(move |webview, args| {
    //             if let Some(args) = args {
    //                 let request: ICoreWebView2WebResourceRequest = args.Request().unwrap(); // manual type to make Rust-Analyzer show the types
    //                 request
    //                     .Headers()
    //                     .unwrap()
    //                     .SetHeader("referrer".to_string(), "http://rocotime.com")
    //                     .unwrap();
    //             }
    //             Ok(())
    //         })),
    //         &mut _token,
    //     );
    // });
}
