import { app, BrowserWindow, ipcMain } from "electron"
import log from "electron-log/main"
import registerListeners from "./helpers/ipc/listeners-register"
// "electron-squirrel-startup" seems broken when packaging with vite
//import started from "electron-squirrel-startup"
import path from "path"
import {
    //installExtension,
    REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer"
/*
import { sqlite } from "sqlite-electron";
import {
    setdbPath,
    executeQuery,
    executeMany,
    executeScript,
    fetchOne,
    fetchMany,
    fetchAll
} from "sqlite-electron"
import { sqlite3 } from 'sqlite3'
*/
import Database from 'better-sqlite3'
import { format } from "date-fns"
import { existsSync, readFileSync } from "fs"

const inDevelopment = process.env.NODE_ENV === "development";

const windowz = new Set()
let mainWindow: BrowserWindow
let categories
function createWindow(url = "") {
    const preloadFileNameWithExt =
        //"preload.ts";
        "preload.js";
    const preload = path.join(__dirname, preloadFileNameWithExt);

    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log('          createWindow          ')
    console.log('--------------------------------')
    console.log(`url = ${url}`)
    console.log(`inDevelopment = ${inDevelopment}`)
    console.log(`preload = ${preload}`)
    console.log(`preloadFileNameWithExt = ${preloadFileNameWithExt}`)
    console.log(`MAIN_WINDOW_VITE_DEV_SERVER_URL = ${MAIN_WINDOW_VITE_DEV_SERVER_URL}`)
    console.log(`MAIN_WINDOW_VITE_NAME = ${MAIN_WINDOW_VITE_NAME}`)
    console.log(`VIEW_WINDOW_VITE_DEV_SERVER_URL = ${VIEW_WINDOW_VITE_DEV_SERVER_URL}`)
    console.log(`VIEW_WINDOW_VITE_NAME = ${VIEW_WINDOW_VITE_NAME}`)
    console.log(`ADD_EDIT_WINDOW_VITE_DEV_SERVER_URL = ${ADD_EDIT_WINDOW_VITE_DEV_SERVER_URL}`)
    console.log(`ADD_EDIT_WINDOW_VITE_NAME = ${ADD_EDIT_WINDOW_VITE_NAME}`)
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')

    // // Get language from url
    let language_from_url = "en"
    let url_without_search_params = url
    if (url !== undefined) {
        // // Could be a potential bug ...
        const url_array = url.split("?language=")
        if (url_array.length > 0) {
            url_without_search_params = url_array[0] ?? url
            language_from_url = url_array[1] ?? language_from_url
        }
    }

    console.log(`url_without_search_params = ${url_without_search_params}`)
    console.log(`language_from_url = ${language_from_url}`)


    let x = 0, y = 0

    const currentWindow = BrowserWindow.getFocusedWindow()
    if (currentWindow) {
        const [currentWindowX, currentWindowY] = currentWindow.getPosition()
        //x = currentWindowX + 24
        x = currentWindowX
        //y = currentWindowY + 24
        y = currentWindowY
    }

    let options = {
        show: false,
        width: Math.ceil(1920 * 2 / 3),
        // height: 1080,
        height: 1080 - 24,
        //backgroundColor: 'white',
        frame: false,
        // // Only in OS X 10.10 Yosemite and newer
        //titleBarStyle: 'hidden',
        webPreferences: {
            //devTools: inDevelopment,
            // // Old way
            //contextIsolation: false,
            contextIsolation: true,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: false,
            preload: preload,
            additionalArguments: [
                `--yourl=${url_without_search_params}`,
                `--language=${language_from_url}`,
            ],
        },
    }

    let newWindow = new BrowserWindow(options);

    let useView = false
    let useAddEdit = false

    // // In Electron, an entry point (i.e. index*.html),
    // // requires its corresponding vite.renderer.*.config.mts,
    // // renderer *.ts, App *.ts and
    // // entry in router.ts, forge.config.ts and types.d.ts
    // // This is poorly documented by Electron/ElectronForge/Vite
    let index_url: string = "/index.html"
    if (url.includes("add-edit-sample")) {
        useAddEdit = true
    }
    if (url.includes("view-sample")) {
        useView = true
    }

    let actual_url = index_url

    if (useAddEdit) {
        index_url = "/index_add_edit.html"
        if (ADD_EDIT_WINDOW_VITE_DEV_SERVER_URL) {

            console.log('~~==~~==~~==> 2000')

            // // This goes back to the main page/renderer. WTF ...
            //actual_url = VIEW_WINDOW_VITE_DEV_SERVER_URL

            actual_url = ADD_EDIT_WINDOW_VITE_DEV_SERVER_URL + index_url

            // // The part after the hash goes undefined in the new window
            //actual_url = VIEW_WINDOW_VITE_DEV_SERVER_URL + index_url + "#" + url

            newWindow.loadURL(actual_url);
        } else {

            console.log('~~==~~==~~==> 2500')

            actual_url = path.join(
                __dirname,
                `../renderer/${ADD_EDIT_WINDOW_VITE_NAME}${index_url}`)

            newWindow.loadFile(actual_url)
        }
    } else if (useView) {
        index_url = "/index_view.html"
        if (VIEW_WINDOW_VITE_DEV_SERVER_URL) {

            console.log('~~==~~==~~==> 3000')

            // // This goes back to the main page/renderer. WTF ...
            //actual_url = VIEW_WINDOW_VITE_DEV_SERVER_URL

            actual_url = VIEW_WINDOW_VITE_DEV_SERVER_URL + index_url

            // // The part after the hash goes undefined in the new window
            //actual_url = VIEW_WINDOW_VITE_DEV_SERVER_URL + index_url + "#" + url

            newWindow.loadURL(actual_url);
        } else {

            console.log('~~==~~==~~==> 3500')

            actual_url = path.join(
                __dirname,
                `../renderer/${VIEW_WINDOW_VITE_NAME}${index_url}`)

            newWindow.loadFile(actual_url)
        }
    } else {
        if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {

            console.log('~~==~~==~~==> 4000')

            actual_url = MAIN_WINDOW_VITE_DEV_SERVER_URL + index_url

            newWindow.loadURL(actual_url);
        } else {

            console.log('~~==~~==~~==> 4500')

            actual_url = path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}${index_url}`)

            newWindow.loadFile(actual_url)
        }
    }

    console.log(`actual_url = ${actual_url}`)

    newWindow.once('ready-to-show', () => {
        //newWindow.maximize()
        newWindow.setPosition(x, y)
        newWindow.show()

        // // Open dev sidebar
        if (inDevelopment) {
            newWindow.webContents.openDevTools()
        }
    })

    newWindow.on('closed', () => {
        windowz.delete(newWindow)
        newWindow = null
    });

    registerListeners(newWindow)

    if (windowz.size == 0) {
        mainWindow = newWindow
    }
    windowz.add(newWindow)

    return newWindow

    /* mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        var allowedUriForNewWindow = [
            "search-sample",
            "add-edit-sample",
            "view-sample"];
        var urlIsIncluded = allowedUriForNewWindow.some(allowedUrlForNewWindow => url.includes(allowedUrlForNewWindow));

        //if (url === 'about:blank') {
        //if (url.includes("add-edit-sample")) {
        if (urlIsIncluded) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    frame: false,
                    fullscreenable: false,
                    width: 1280,
                    height: 960,
                    title: 'window ' + Math.floor(Math.random() * 88),
                    backgroundColor: 'blue',
                    webPreferences: {
                        //preload: 'my-child-window-preload-script.js'
                    }
                }
            }
        }

        console.log(url + ' is not allowed');

        return { action: 'deny' }
    }) */
}


// // Read data from a file in a directory (for DEV) 
// // or ASAR (for PROD) of this project
function getJSONFromFile(filenameWithExtension: string): any {
    //const userDataPath = app.getPath('appData')
    //const igxDirectoryPath = path.join(userDataPath, 'Project_Name')
    //const parentDirectoryPath = path.join(igxDirectoryPath, 'Folder_Name')
    const parentDirectoryPath = './resources/data'

    const filePath = path.join(parentDirectoryPath, filenameWithExtension)

    console.log('getJSONFromFile: attempting to access ', filePath)

    let jsonObjects = JSON.stringify({})
    if (existsSync(filePath)) {
        const data = readFileSync(filePath, 'utf8')

        //console.log('getJSONFromFile: data = ', data)

        jsonObjects = JSON.parse(data)
    }

    return jsonObjects
}

// Get categories from that JSON file
function getCategories() {
    try {
        categories = getJSONFromFile('categories.json')
        if (categories) {

            console.log(`categories.length = ${categories.length}`)
            //console.log('categories = ', categories)

            for (let i = 0; i < categories.length; i++) {
                const category = categories[i];

                console.log(`===> ${i} : title: ${category.title}, value: ${category.value}`)

            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

// app.whenReady().then(createWindow); // .then(installExtensions);
app.whenReady().then(() => {

    try {
        // This goes to C:\Users\pmg\AppData\Roaming\sample-browser\logs\main.log
        log.initialize();

        log.info(`Log from the main process. app.isPackaged = ${app.isPackaged}`);

        /* const database = new sqlite3.Database('./industry.db', (err) => {
            if (err) console.error('Database opening error: ', err);
        });

        (async () => {
            try {

                console.log('~~~111~~~');

                //await setdbPath("file:industry.db?mode:rw", true)
                await setdbPath('./industry.db')

                let k = 8
                while (k > 0) {
                    console.log(`{k} : was the db file created`);
                    k--
                }

                console.log('~~~222~~~');

            }
            catch (err) {
                console.log(err);
            }
        })() */

        console.log('~~~333~~~');

        ipcMain.handle("ping", async (event) => {

            console.log('ipcMain:ping invoked')

            // yes
            //await setdbPath("file:my.db?mode:rw", true)

            // no
            //event.reply('startDbResult', { status: 'ok' })

            return { status: 'ok' }
        });

        console.log('~~~444~~~');

        log.debug('app.getPath(\'userData\') =  ', app.getPath('userData'))

        // // If the database file is not found, create a new one
        let dbFilePath =
            //"./resources/data/industry.db"
            "./industry.db"

        if (app.isPackaged) {

            log.debug('process.env.PORTABLE_EXECUTABLE_DIR =  ', process.env.PORTABLE_EXECUTABLE_DIR)

            // // workaround to getting electron to create the
            // // SQLite db in the same directory as the EXE
            app.setPath("userData", process.env.PORTABLE_EXECUTABLE_DIR)

            dbFilePath = path.join(
                // // Some random dir in C:\Users\pmg\AppData\Local\Temp ... and it chnages on every run :)
                // process.resourcesPath,
                //app.getAppPath(),
                //app.getPath("exe"),
                app.getPath("userData"),
                'industry.db')
        }

        let logText = `dbFilePath = ${dbFilePath}`
        log.debug(logText)

        if (existsSync(dbFilePath)) {

            logText = `${dbFilePath} exists`
            log.debug(logText)
            console.log(logText)

        } else {

            const schemaFilePath = "./resources/data/industry.sql"

            logText = `${dbFilePath} does not exists. Constructing a new one based on ${schemaFilePath}`
            log.debug(logText)
            console.log(logText)

            if (existsSync(schemaFilePath)) {
                // // First create the database
                const newDb = new Database(dbFilePath, {});

                // // Then create the tables & indices
                const migration = readFileSync(schemaFilePath, 'utf8');
                newDb.exec(migration);
                newDb.close();
            } else {

                logText = `${schemaFilePath} does not exists. Unable to construct database`
                log.debug(logText)
                console.log(logText)

            }
        }

        // // Hopefully the database has been created at this point
        const database = new Database(dbFilePath, {});
        database.pragma('journal_mode = WAL');

        logText = `${dbFilePath} init ok`
        log.info(logText)
        console.log(logText)

        // ~~~~~~~~~~~~~~~~~~~~

        // // i.e. send in preload
        ipcMain.on('getCategories', async (event) => {

            console.log('ipcMain:getCategories : invoked')

            // // i.e. receive in preload
            event.reply('categories',
                categories
            );
        });

        // ~~~~~~~~~~~~~~~~~~~~

        const sharedIpcs = [
            { send: 'fetchMany', receive: 'many' },
            { send: 'fetchMany_2', receive: 'many_2' }
        ];
        sharedIpcs.map((sharedIpc) => {
            //ipcMain.on('fetchMany', async (event, params) => {
            ipcMain.on(sharedIpc.send, async (event, params) => {

                console.log(`ipcMain:${sharedIpc.send} invoked`)

                const { query, values, pagination } = params

                console.log('~~~> BEFORE: query =', query)
                console.log('~~~> values =', values)
                console.log('~~~> pagination =', pagination)

                let totalResultCount = 0
                let queryPlus = query

                if (pagination) {
                    // // Get total result count
                    const queryCount = "SELECT COUNT(*) AS QOUNT FROM (" + query + ") ZZZ";
                    const stmtCount = database.prepare(queryCount)
                    const rowsCount = stmtCount.all(values)

                    console.log('~~~> rowsCount = ', rowsCount)

                    totalResultCount = rowsCount[0].QOUNT

                    console.log('~~~> totalResultCount =', totalResultCount)

                    //Here, We will set the "starting_row" to 5 and "LIMIT" is 5 as well.
                    //SELECT * FROM employees LIMIT 5 OFFSET 5;

                    queryPlus += ` LIMIT ${pagination.limit} OFFSET ${pagination.limit * (pagination.page - 1)}`

                    console.log('~~~> AFTER: queryPlus =', queryPlus)
                }

                const stmt = database.prepare(queryPlus)
                const rows = stmt.all(values)

                console.log('~~~> rows.length =', rows.length)
                // // Too verbose
                //console.log('~~~> rows =', rows)

                //return await database.prepare(query).all(values)
                let rezults = {}
                if (pagination) {
                    rezults = {
                        rows: rows,
                        totalResultCount: totalResultCount,
                        ...pagination
                    }
               //rezults
                rezults[0]
            )
        });

        // ~~~~~~~~~~~~~~~~~~~~

        ipcMain.on("openNewWindow", async (event, url) => {
            createWindow(url)
        })

    }
    catch (err) {
        console.log(err);
    }

    getCategories()

    createWindow()
})

//osX only
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
//osX only ends
