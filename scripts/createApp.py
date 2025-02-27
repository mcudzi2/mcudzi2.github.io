from colorama import init, Fore, Back, Style
from pydash import replace, pascal_case, slugify, camel_case
from os import mkdir
from shutil import copy
import re

def getFormattedPrompt(prompt, defaultValue = None, options = []):
    formattedString = Fore.GREEN
    formattedString += prompt
    if len(options):
        formattedString += " (" + "/".join(options) + ")"
    formattedString += Style.RESET_ALL
    if defaultValue != None:
        formattedString += " ["
        formattedString += Fore.YELLOW + str(defaultValue) + Style.RESET_ALL
        formattedString += "]"
    formattedString += ":"
    return formattedString

def promptBool(prompt, defaultValue):
    positiveResponses = ['y', 'yes', 't', 'true', '1']
    negativeResponses = ['n', 'no', 'f', 'false', '0']
    inputValue = None
    while inputValue == None:
        defaultInputValue = None
        if defaultValue != None:
            defaultInputValue = 'yes' if bool(defaultValue) else 'no'
        print(getFormattedPrompt(prompt, defaultInputValue, ['yes','no']))
        inputValue = input(">>> ").lower()
        if inputValue == "":
            inputValue = defaultValue
        elif inputValue not in positiveResponses and inputValue not in negativeResponses:
            inputValue = None
        if inputValue == None:
            print('')
    if inputValue in positiveResponses:
        return True
    if inputValue in negativeResponses:
        return False
    return defaultValue

def promptStr(prompt, defaultValue):
    inputValue = None
    while inputValue == None:
        print(getFormattedPrompt(prompt, defaultValue))
        inputValue = input(">>> ")
        if inputValue == "":
            inputValue = defaultValue
        if inputValue == None:
            print('')
    return inputValue

def promptInput(prompt, defaultValue = None, inputType = "str"):
    match inputType:
        case 'bool':
            return promptBool(prompt, defaultValue)
        case 'str':
            return promptStr(prompt, defaultValue)
        case _:
            return promptStr(prompt, defaultValue)

def replaceTextInFile(filePath, searchStr, replaceStr):
    with open(filePath, 'r') as file:
      fileData = file.read()
    fileData = fileData.replace(searchStr, replaceStr)
    with open(filePath, 'w') as file:
      file.write(fileData)

def setUpApp(appName, appConfig):
    repoBasePath = 'C:/Users/micha/Documents/Programming/githubpage'
    partialsPath = repoBasePath + '/scripts/partials'
    dirPath = appConfig['dirPath']

    # Create directories
    mkdir(repoBasePath + dirPath)
    mkdir(repoBasePath + dirPath + '/components')
    mkdir(repoBasePath + dirPath + '/pages')

    # Create app config
    filePath = repoBasePath + dirPath + "/app.config.js"
    copy(partialsPath + "/appBlueprint.config.js", filePath)
    replaceTextInFile(filePath, "__APP_COMPONENT_NAME", appConfig['componentName'])
    replaceTextInFile(filePath, "__APP_DIR_NAME", appConfig['dirName'])
    replaceTextInFile(filePath, "__APP_NAME", appConfig['name'])
    replaceTextInFile(filePath, "__APP_ROUTE", appConfig['route'])
    replaceTextInFile(filePath, "__APP_HOME_COMPONENT_NAME", appConfig['homeComponentName'])

    # Create app base component
    filePath = repoBasePath + appConfig['componentPath']
    copy(partialsPath + "/AppBlueprint.vue", filePath)
    replaceTextInFile(filePath, "__APP_COMPONENT_NAME", appConfig['componentName'])
    replaceTextInFile(filePath, "__APP_DIR_NAME", appConfig['dirName'])
    replaceTextInFile(filePath, "__APP_NAME", appConfig['name'])
    replaceTextInFile(filePath, "__APP_ROUTE", appConfig['route'])
    replaceTextInFile(filePath, "__APP_HOME_COMPONENT_NAME", appConfig['homeComponentName'])

    # Create app base component
    filePath = repoBasePath + appConfig['homeComponentPath']
    copy(partialsPath + "/AppHomeBlueprint.vue", filePath)
    replaceTextInFile(filePath, "__APP_COMPONENT_NAME", appConfig['componentName'])
    replaceTextInFile(filePath, "__APP_DIR_NAME", appConfig['dirName'])
    replaceTextInFile(filePath, "__APP_NAME", appConfig['name'])
    replaceTextInFile(filePath, "__APP_ROUTE", appConfig['route'])
    replaceTextInFile(filePath, "__APP_HOME_COMPONENT_NAME", appConfig['homeComponentName'])

    # Register app with main app
    mainAppPath = repoBasePath + "/src/main.js"
    try:
        with open(mainAppPath, 'r') as file:
            lines = file.readlines()
    except FileNotFoundError:
        print(f"Error: File not found: {mainAppPath}")
        return

    with open(mainAppPath, 'w') as file:
        lineNum = 0

        # Find line with comment and go to next line
        while "@appRegistration" not in lines[lineNum]:
            file.write(lines[lineNum])
            lineNum += 1
        file.write(lines[lineNum])
        lineNum += 1

        # Add appConfig import
        while "import { appConfig" in lines[lineNum]:
            file.write(lines[lineNum])
            lineNum += 1
        importAs = camel_case(appConfig['dirName'])
        file.write('import { appConfig as ' + importAs + ' } from "@/apps/' + appConfig['dirName'] + '/app.config.js";' + '\n')

        # Add call to register app
        while "AppManager.registerApp" not in lines[lineNum]:
            file.write(lines[lineNum])
            lineNum += 1
        while "AppManager.registerApp" in lines[lineNum]:
            file.write(lines[lineNum])
            lineNum += 1
        file.write(f"AppManager.registerApp({importAs});" + '\n')

        while lineNum < len(lines):
            file.write(lines[lineNum])
            lineNum += 1

    # Register app with router
    routerPath = repoBasePath + "/src/router.js"
    try:
        with open(routerPath, 'r') as file:
            lines = file.readlines()
    except FileNotFoundError:
        print(f"Error: File not found: {routerPath}")
        return

    with open(routerPath, 'w') as file:
        lineNum = 0

        # Find line with comment and go to next line
        while "@appRegistration" not in lines[lineNum]:
            file.write(lines[lineNum])
            lineNum += 1
        file.write(lines[lineNum])
        lineNum += 1

        # Add call to register routes
        while "AppManager.registerAppRoutes" in lines[lineNum]:
            file.write(lines[lineNum])
            lineNum += 1
        file.write(f"    AppManager.registerAppRoutes(routerConfig, '{appName}');" + '\n')

        while lineNum < len(lines):
            file.write(lines[lineNum])
            lineNum += 1

appName = promptInput("Enter App Name")
print('')

appDirName = pascal_case(appName)
appDir = "/src/apps/" + appDirName
while not promptInput("App directory will be created at " + appDir + ". Continue?", True, "bool"):
    appDirName = pascal_case(replace(promptInput("Enter App Directory Name"), " ", ""), False)
    appDir = "/src/apps/" + appDirName
print('')

appRoute = slugify(appName)
while not promptInput("App will be registered at route /" + appRoute + ". Continue?", True, "bool"):
    appRoute = promptInput("Enter base route for " + appName)
    appRouteParts = list(filter(len, appRoute.split("/")))
    appRouteParts = list(map(slugify, appRouteParts))
    appRoute = "/".join(appRouteParts)
print('')

appComponentName = pascal_case(appName)
appComponentPath = appDir + "/" + appComponentName + ".vue"
while not promptInput("App base component " + appComponentName + " will be created at " + appComponentPath + ". Continue?", True, "bool"):
    appComponentName = pascal_case(replace(replace(promptInput("Enter App Base Component Name"), " ", ""), ".vue", ""), False)
    appComponentPath = appDir + "/" + appComponentName + ".vue"
print('')

appHomeComponentName = pascal_case(appName) + "Home"
appHomeComponentPath = appDir + "/pages/" + appHomeComponentName + ".vue"
while not promptInput("App homepage component " + appHomeComponentName + " will be created at " + appHomeComponentPath + ". Continue?", True, "bool"):
    appHomeComponentName = pascal_case(replace(replace(promptInput("Enter App Homepage Component Name"), " ", ""), ".vue", ""), False)
    appHomeComponentPath = appDir + "/pages/" + appHomeComponentName + ".vue"
print('')

print(Fore.GREEN + "This script will perform the following:" + Style.RESET_ALL)
print(Fore.CYAN + "  1) Set up new app directory at " + appDir)
print("  2) Create base app component at " + appComponentPath)
print("  3) Set up app base route at " + appRoute)
print("  4) Set up base route in routes and create route homepage component at " + appHomeComponentPath)
print("  5) Register app " + appName + " and routes with base app and router" + Style.RESET_ALL)
if promptInput("Continue with the above actions?", False, "bool"):
    print("Setting up " + appName + "...")
    config = {
        'name': appName,
        'dirName': appDirName,
        'dirPath': appDir,
        'componentName': appComponentName,
        'componentPath': appComponentPath,
        'homeComponentName': appHomeComponentName,
        'homeComponentPath': appHomeComponentPath,
        'route': appRoute
    }
    setUpApp(appName, config)
    print("Setup complete.")
else:
    print("Aborting operation...")