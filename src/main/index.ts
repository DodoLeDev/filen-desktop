import { app, BrowserWindow, powerMonitor, Menu } from "electron"
import log from "electron-log"
import is from "electron-is"
import { autoUpdater } from "electron-updater"
import {
	linuxCheckLibAppIndicator,
	positionWindow,
	toggleMainWindow
} from "./lib/tray"
import { createWindows, createUpdate } from "./lib/windows"
import { emitGlobal, updateKeybinds } from "./lib/ipc"
import memoryCache from "./lib/memoryCache"

// @ts-ignore
process.noAsar = true

app.disableHardwareAcceleration()
//app.commandLine.appendSwitch("wm-window-animations-disabled")
app.commandLine.appendSwitch("disable-renderer-backgrounding")
app.commandLine.appendSwitch("disable-pinch")
app.commandLine.appendSwitch("js-flags", "--max-old-space-size=16384")
app.commandLine.appendSwitch("no-sandbox")
app.commandLine.appendSwitch("no-proxy-server")

if (is.dev()) {
	app.commandLine.appendSwitch("ignore-certificate-errors")
	app.commandLine.appendSwitch("allow-insecure-localhost", "true")
}

let CHECK_UPDATE_INTERVAL: NodeJS.Timer
let UPDATE_WINDOW_SHOWN = false

autoUpdater.logger = log
autoUpdater.allowDowngrade = false
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = false

const initWindows = async () => {
	log.info("Initializing startup windows")

	if (is.linux()) {
		const trayAvailable = await linuxCheckLibAppIndicator()

		memoryCache.set("trayAvailable", trayAvailable)
	} else {
		memoryCache.set("trayAvailable", true)
	}

	await createWindows()
}

autoUpdater.on("checking-for-update", () => {
	log.info("Checking if an update is available")

	emitGlobal("checkingForUpdate", {})
})

autoUpdater.on("update-available", info => {
	log.info("Update available:", info)

	emitGlobal("updateAvailable", info)
})

autoUpdater.on("update-not-available", info => {
	//log.info("No update available:", info)

	emitGlobal("updateNotAvailable", info)
})

autoUpdater.on("error", err => {
	log.info(err)

	emitGlobal("updateError", err)
})

autoUpdater.on("download-progress", progress => {
	log.info("Downloading update:", progress)

	emitGlobal("updateDownloadProgress", progress)
})

autoUpdater.on("update-downloaded", info => {
	log.info("Update downloaded:", info)

	emitGlobal("updateDownloaded", info)

	if (!UPDATE_WINDOW_SHOWN) {
		UPDATE_WINDOW_SHOWN = true

		autoUpdater.autoInstallOnAppQuit = false

		setTimeout(() => {
			createUpdate(info.version).catch(err => {
				log.error(err)

				UPDATE_WINDOW_SHOWN = false
			})
		}, 5000)
	}
})

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length == 0) {
		initWindows()
	}
})

app.on("second-instance", () => {
	positionWindow()
	toggleMainWindow()
})

powerMonitor.on("shutdown", () => {
	app.exit(0)
})

if (!app.requestSingleInstanceLock()) {
	app.quit()
} else {
	app.whenReady().then(() => {
		app.setAccessibilitySupportEnabled(false)

		Menu.setApplicationMenu(
			Menu.buildFromTemplate([
				{
					label: "Application",
					submenu: [
						{
							label: "About Application"
						},
						{
							type: "separator"
						},
						{
							label: "Quit",
							accelerator: "Command+Q",
							click: () => {
								app.quit()
							}
						}
					]
				},
				{
					label: "Edit",
					submenu: [
						{
							label: "Undo",
							accelerator: "CmdOrCtrl+Z"
						},
						{
							label: "Redo",
							accelerator: "Shift+CmdOrCtrl+Z"
						},
						{
							type: "separator"
						},
						{
							label: "Cut",
							accelerator: "CmdOrCtrl+X"
						},
						{
							label: "Copy",
							accelerator: "CmdOrCtrl+C"
						},
						{
							label: "Paste",
							accelerator: "CmdOrCtrl+V"
						},
						{
							label: "Select All",
							accelerator: "CmdOrCtrl+A"
						}
					]
				}
			])
		)

		autoUpdater.checkForUpdates().catch(log.error)

		clearInterval(CHECK_UPDATE_INTERVAL)

		CHECK_UPDATE_INTERVAL = setInterval(() => {
			autoUpdater.checkForUpdates().catch(log.error)
		}, 3600000 * 6)

		initWindows()

		updateKeybinds().catch(log.error)
	})
}
