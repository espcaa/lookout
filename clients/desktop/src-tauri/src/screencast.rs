#[cfg(target_os = "linux")]
use ashpd::desktop::screencast::{CursorMode, PersistMode, ScreenCast, SourceType};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct StreamInfo {
    pub node_id: u32,
}

#[cfg(target_os = "linux")]
pub async fn request_screencast() -> Result<Vec<StreamInfo>, String> {
    let session = ScreenCast::builder()
        .multiple(true)
        .cursor_mode(CursorMode::Hidden)
        .persist_mode(PersistMode::DoNot)
        .source_type(SourceType::Monitor | SourceType::Window)
        .build()
        .await
        .map_err(|e| format!("Failed to create ScreenCast builder: {}", e))?;

    let response = session
        .response()
        .map_err(|e| format!("Failed to get ScreenCast response: {}", e))?;

    let mut streams = Vec::new();
    for stream in response.streams() {
        streams.push(StreamInfo {
            node_id: stream.pipe_wire_node_id(),
        });
    }

    Ok(streams)
}
