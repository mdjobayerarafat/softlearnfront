import { getAPIUrl, getBackendUrl } from '@services/config/config'
import { RequestBodyWithAuthHeader } from '@services/utils/ts/requests'

// Environment configuration to determine if local Ollama should be used
const useLocalOllama = process.env.NEXT_PUBLIC_USE_LOCAL_OLLAMA === 'true'
const localOllamaUrl = process.env.NEXT_PUBLIC_LOCAL_OLLAMA_URL || 'http://localhost:11434'
const localOllamaModel = process.env.NEXT_PUBLIC_LOCAL_OLLAMA_MODEL

export async function startActivityAIChatSession(
  message: string,
  access_token: string,
  activity_uuid?: string
) {
  if (useLocalOllama) {
    return startLocalOllamaSession(message, activity_uuid)
  }

  const data = {
    message,
    activity_uuid,
  }
  const result = await fetch(
    `${getAPIUrl()}ai/start/activity_chat_session`,
    RequestBodyWithAuthHeader('POST', data, null, access_token)
  )
  const json = await result.json()
  if (result.status === 200) {
    return {
      success: true,
      data: json,
      status: result.status,
      HTTPmessage: result.statusText,
    }
  } else {
    return {
      success: false,
      data: json,
      status: result.status,
      HTTPmessage: result.statusText,
    }
  }
}

export async function sendActivityAIChatMessage(
  message: string,
  aichat_uuid: string,
  activity_uuid: string,
  access_token: string
) {
  if (useLocalOllama) {
    return sendLocalOllamaMessage(message, aichat_uuid)
  }

  const data = {
    aichat_uuid,
    message,
    activity_uuid,
  }
  const result = await fetch(
    `${getAPIUrl()}ai/send/activity_chat_message`,
    RequestBodyWithAuthHeader('POST', data, null, access_token)
  )

  const json = await result.json()
  if (result.status === 200) {
    return {
      success: true,
      data: json,
      status: result.status,
      HTTPmessage: result.statusText,
    }
  } else {
    return {
      success: false,
      data: json,
      status: result.status,
      HTTPmessage: result.statusText,
    }
  }
}

// Local Ollama implementation
async function startLocalOllamaSession(message: string, activity_uuid?: string) {
  try {
    const response = await fetch(`${localOllamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: localOllamaModel,
        messages: [
          { role: 'system', content: 'You are a helpful AI tutor for educational content.' },
          { role: 'user', content: message }
        ],
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        data: { detail: `Ollama error: ${errorData.error || 'Unknown error'}` },
        status: response.status,
        HTTPmessage: response.statusText,
      }
    }

    const json = await response.json()

    // Generate a local UUID for chat tracking
    const localUuid = 'local-' + Math.random().toString(36).substring(2, 15)

    return {
      success: true,
      data: {
        aichat_uuid: localUuid,
        message: json.message?.content || 'No response from Ollama',
      },
      status: 200,
      HTTPmessage: 'OK',
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: { detail: `Failed to connect to Ollama: ${errorMessage}` },
      status: 500,
      HTTPmessage: 'Internal Server Error',
    }
  }
}

async function sendLocalOllamaMessage(message: string, aichat_uuid: string) {
  try {
    const response = await fetch(`${localOllamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: localOllamaModel,
        messages: [
          { role: 'system', content: 'You are a helpful AI tutor for educational content.' },
          { role: 'user', content: message }
        ],
        stream: false
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return {
        success: false,
        data: { detail: `Ollama error: ${errorData.error || 'Unknown error'}` },
        status: response.status,
        HTTPmessage: response.statusText,
      }
    }

    const json = await response.json()

    return {
      success: true,
      data: {
        message: json.message?.content || 'No response from Ollama',
      },
      status: 200,
      HTTPmessage: 'OK',
    }
  } catch(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      data: { detail: `Failed to connect to Ollama: ${errorMessage}` },
      status: 500,
      HTTPmessage: 'Internal Server Error',
    }
  }
}