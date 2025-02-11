# ALLM (WIP)

ALLM is an Electron app that enables the local use of all\* (WIP) LLM models.

## Configuration

API keys for providers are stored locally in the application's configuration file using the following structure:

```json
{
  "providers": {
    "openai": {
      "apiKey": ""
    }
    // other providers
  }
}
```

The configuration file can be found in the user's home folder.

### MacOS

```shell
/Users/$user/.config/allm/config.json
```

### Linux

Not yet supported

### Windows

Not yet supported

\* "all" meaning just these that counts
