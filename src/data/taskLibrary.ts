import { Task, TaskCategory } from '../types';

export const TASK_CATEGORIES: TaskCategory[] = [
  'Computer Basics',
  'Files and Folders',
  'Internet and Browsers',
  'Windows Settings',
  'Devices and Connectivity',
  'Documents and Productivity',
  'Programming and Development',
  'Troubleshooting',
];

export const VERIFIED_TASKS: Task[] = [
  // 1. Computer Basics
  {
    id: 'pin-app-to-taskbar',
    title: 'Pin an application to the Taskbar',
    category: 'Computer Basics',
    difficulty: 'First-time User',
    osContext: 'Windows 11 / 10',
    summary:
      'Keep your favorite programs (like Word, Chrome, or VS Code) one click away at the bottom of your screen.',
    prerequisites: 'The app is installed on your computer.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open the Start menu',
        instruction:
          'Click the Windows logo button in the bottom taskbar (or press the Windows key on your keyboard).',
        actionType: 'click',
        targetElement: 'Windows logo Start button',
      },
      {
        stepNumber: 2,
        title: 'Search for the app',
        instruction:
          'Start typing the name of the app you want to pin (for example, "Chrome" or "Notepad"). The search results will show the app at the top.',
        actionType: 'type',
        targetElement: 'Start menu search box',
      },
      {
        stepNumber: 3,
        title: 'Right-click the app in search results',
        instruction:
          'Do not left-click it (which just opens it). Instead, right-click the app icon in the search results to see options.',
        actionType: 'right_click',
        targetElement: 'App item in search list',
      },
      {
        stepNumber: 4,
        title: 'Click "Pin to taskbar"',
        instruction:
          'In the menu that appears, click the option with the push-pin icon labeled "Pin to taskbar".',
        actionType: 'click',
        targetElement: '"Pin to taskbar" option',
      },
    ],
    expectedResult:
      'The application icon is permanently visible on your bottom bar, even when the app is closed.',
    commonProblems: [
      {
        issue: 'If the app is already open right now, is there a faster way?',
        solution:
          'Yes! When the app is running, just right-click its icon on the bottom taskbar and click "Pin to taskbar".',
      },
    ],
    learningTakeaway:
      'Pinned taskbar icons give you 1-click access to the apps you use daily.',
    tags: ['taskbar', 'pin', 'shortcuts', 'start menu', 'windows', 'basics'],
  },
  {
    id: 'take-screenshot-snipping-tool',
    title: 'Take a selective screenshot with Snipping Tool',
    category: 'Computer Basics',
    difficulty: 'First-time User',
    osContext: 'Windows 11 / 10',
    summary:
      'Capture an exact rectangle or window on your screen to share with a mentor, classmate, or support.',
    prerequisites: 'The content you want to capture is visible on your screen.',
    steps: [
      {
        stepNumber: 1,
        title: 'Press the screenshot shortcut',
        instruction:
          'Press and hold three keys together: Windows Key + Shift + S.',
        actionType: 'shortcut',
        targetElement: 'Win + Shift + S keys',
        tip: 'Your entire screen will dim slightly, and a small toolbar will appear at the top center of your monitor.',
      },
      {
        stepNumber: 2,
        title: 'Select Rectangle mode',
        instruction:
          'Look at the small toolbar at the very top. The first icon (a dashed box with a plus) is Rectangular Snip and is usually selected by default.',
        actionType: 'look',
        targetElement: 'Top screen Snipping Tool bar',
      },
      {
        stepNumber: 3,
        title: 'Click and drag over the area',
        instruction:
          'Click and hold down your left mouse button at the corner of what you want to capture, drag the box across the area, then release your mouse button.',
        actionType: 'drag',
        targetElement: 'Crosshair cursor dragging across the screen',
      },
      {
        stepNumber: 4,
        title: 'Save or paste your screenshot',
        instruction:
          'The screenshot is immediately saved to your clipboard. You can paste it into an email or document with Ctrl + V, or click the bottom-right notification to save as an image file.',
        actionType: 'look',
        targetElement: 'Bottom-right notification popup',
      },
    ],
    expectedResult:
      'Your captured area is copied to your clipboard and saved in Pictures > Screenshots.',
    commonProblems: [
      {
        issue: 'I did not see any notification after capturing.',
        solution:
          'Open File Explorer, go to Pictures, and open the "Screenshots" folder. Windows automatically saves every snip there.',
      },
    ],
    learningTakeaway:
      'Win + Shift + S is the universal Windows shortcut for fast, precise screenshots without installing third-party apps.',
    tags: ['screenshot', 'snip', 'snipping tool', 'capture', 'screen'],
  },

  // 2. Files and Folders
  {
    id: 'create-new-folder',
    title: 'Create a new folder on the Desktop or in Documents',
    category: 'Files and Folders',
    difficulty: 'First-time User',
    osContext: 'Windows 11 / 10',
    summary:
      'Keep your laptop tidy by creating designated folders for your classes, projects, or photos.',
    prerequisites: 'You are looking at your Desktop or any open folder in File Explorer.',
    steps: [
      {
        stepNumber: 1,
        title: 'Find empty space',
        instruction:
          'Move your mouse to an empty area on your Desktop where there are no existing icons or open windows.',
        actionType: 'look',
        targetElement: 'Blank desktop background space',
      },
      {
        stepNumber: 2,
        title: 'Right-click the empty space',
        instruction:
          'Right-click on that blank space. A context menu will appear.',
        actionType: 'right_click',
        targetElement: 'Desktop context menu',
      },
      {
        stepNumber: 3,
        title: 'Hover over "New"',
        instruction:
          'Move your mouse down to "New". A second smaller menu will open beside it.',
        actionType: 'look',
        targetElement: '"New" submenu in context menu',
      },
      {
        stepNumber: 4,
        title: 'Click "Folder"',
        instruction:
          'Click the first option at the top of that sub-menu labeled "Folder".',
        actionType: 'click',
        targetElement: '"Folder" option',
        tip: 'Shortcut: You can also use Ctrl + Shift + N inside any File Explorer window.',
      },
      {
        stepNumber: 5,
        title: 'Type a name and press Enter',
        instruction:
          'The words "New folder" are highlighted in blue. Immediately type your desired folder name (e.g. "Biology 101") and press the Enter key.',
        actionType: 'type',
        targetElement: 'Folder name text box',
      },
    ],
    expectedResult:
      'A new yellow folder with your custom title appears on your desktop, ready to hold files.',
    commonProblems: [
      {
        issue: 'I accidentally clicked away and the name is stuck as "New folder".',
        solution:
          'Right-click the folder and choose the "Rename" icon (or press F2 on your keyboard) to re-type the name.',
      },
    ],
    learningTakeaway:
      'Folders are digital containers. You can drag and drop any file directly onto the folder to put it inside.',
    tags: ['folder', 'desktop', 'organize', 'new folder', 'file management'],
  },
  {
    id: 'rename-file-or-folder',
    title: 'Rename a file or folder safely',
    category: 'Files and Folders',
    difficulty: 'First-time User',
    osContext: 'Windows 11 / 10',
    summary:
      'Give meaningful names to documents and photos so you can find them later without corrupting file extensions.',
    prerequisites: 'The file or folder you want to rename is visible.',
    steps: [
      {
        stepNumber: 1,
        title: 'Select the file',
        instruction:
          'Click once with your left mouse button on the file or folder you want to rename so it is highlighted.',
        actionType: 'click',
        targetElement: 'The file or folder icon',
      },
      {
        stepNumber: 2,
        title: 'Open rename mode',
        instruction:
          'Press the F2 key on the top row of your keyboard, or right-click the file and click the small "Rename" icon (a tiny rectangle with an uppercase cursor).',
        actionType: 'shortcut',
        targetElement: 'F2 key or Rename icon',
      },
      {
        stepNumber: 3,
        title: 'Type the new name',
        instruction:
          'Type the new name you want. If you are renaming a file with an extension like .pdf or .docx, keep the .pdf at the end.',
        actionType: 'type',
        targetElement: 'Highlighted text field',
      },
      {
        stepNumber: 4,
        title: 'Press Enter',
        instruction:
          'Press the Enter key on your keyboard to save the name.',
        actionType: 'shortcut',
        targetElement: 'Enter key',
      },
    ],
    expectedResult: 'The file or folder displays your new name.',
    commonProblems: [
      {
        issue: 'Windows showed a warning: "If you change a file name extension, the file might become unusable."',
        solution:
          'Make sure you keep the dot and the 3-4 letters at the end (like .jpg or .docx). If in doubt, click "No" and try again.',
      },
    ],
    learningTakeaway:
      'Naming files descriptively (e.g. "Math_Homework_Oct29.pdf") saves hours of searching later.',
    tags: ['rename', 'file', 'f2', 'folder', 'organize'],
  },

  // 3. Internet and Browsers
  {
    id: 'download-image-from-web',
    title: 'Download an image from a website',
    category: 'Internet and Browsers',
    difficulty: 'First-time User',
    osContext: 'Windows 11 / 10 / All Browsers',
    summary:
      'Save a picture or diagram from a webpage onto your laptop so you can view it offline or use it in a project.',
    prerequisites: 'A webpage with the image you want is open on your screen.',
    steps: [
      {
        stepNumber: 1,
        title: 'Point directly at the picture',
        instruction:
          'Move your mouse cursor so the pointer is sitting directly over the middle of the picture you want to save.',
        actionType: 'look',
        targetElement: 'The image on the webpage',
      },
      {
        stepNumber: 2,
        title: 'Right-click the image',
        instruction:
          'Press the right mouse button (or tap with two fingers on your laptop trackpad). A context menu will pop open on the screen.',
        actionType: 'right_click',
        targetElement: 'Image context menu',
      },
      {
        stepNumber: 3,
        title: 'Select "Save image as..."',
        instruction:
          'In the context menu, read down the list and click "Save image as..." (or "Save picture as...").',
        actionType: 'click',
        targetElement: '"Save image as..." menu item',
      },
      {
        stepNumber: 4,
        title: 'Choose where to save and give it a name',
        instruction:
          'A Windows File dialog will open. On the left side, click "Downloads" or "Pictures". At the bottom, type a name you will remember into the "File name" box.',
        actionType: 'type',
        targetElement: 'Save Dialog "File name" input',
      },
      {
        stepNumber: 5,
        title: 'Click "Save"',
        instruction:
          'Click the "Save" button in the lower-right corner of the window.',
        actionType: 'click',
        targetElement: '"Save" button',
      },
    ],
    expectedResult:
      'The file downloads to your chosen folder. A small download tray notification will appear in your browser.',
    commonProblems: [
      {
        issue: 'I right-clicked, but I only see "Save as..." and it saves a whole HTML webpage.',
        solution:
          'The picture might be an interactive slideshow or a background. Try left-clicking the image first to open it full size, then right-click again.',
      },
    ],
    learningTakeaway:
      'Right-clicking gives you context actions for whatever object you point at. "Save image as..." lets you store files anywhere on your disk.',
    tags: ['download', 'save', 'picture', 'image', 'photo', 'browser'],
  },
  {
    id: 'chrome-new-profile',
    title: 'Create a new Google Chrome profile',
    category: 'Internet and Browsers',
    difficulty: 'Beginner',
    osContext: 'Windows 11 / 10 / Web Browsers',
    summary:
      'Separate your school, work, or personal browsing so your bookmarks, passwords, and history do not mix.',
    prerequisites: 'Google Chrome must be open on your screen.',
    steps: [
      {
        stepNumber: 1,
        title: 'Find your profile icon',
        instruction:
          'Look at the very top-right corner of Google Chrome. You will see a small circular profile icon (next to the three vertical dots).',
        actionType: 'look',
        targetElement: 'Top-right circular avatar button',
      },
      {
        stepNumber: 2,
        title: 'Click the profile icon',
        instruction:
          'Click the circular profile icon once with your left mouse button to open the profile menu.',
        actionType: 'click',
        targetElement: 'Profile avatar',
      },
      {
        stepNumber: 3,
        title: 'Click "Add" profile',
        instruction:
          'At the bottom of that dropdown menu, look for "+ Add" or a gear icon labeled "Other profiles" and click "+ Add".',
        actionType: 'click',
        targetElement: '"+ Add" button at the bottom of the dropdown',
      },
      {
        stepNumber: 4,
        title: 'Choose account option',
        instruction:
          'Click "Continue without an account" if you just want a clean local profile, or "Sign in" if you have a separate school or personal Google email.',
        actionType: 'click',
        targetElement: '"Continue without an account" or "Sign in"',
      },
      {
        stepNumber: 5,
        title: 'Name your profile and pick a color',
        instruction:
          'Type a friendly name for this profile (such as "School" or "Work") and choose a theme color, then click "Done".',
        actionType: 'type',
        targetElement: 'Name input box and "Done" button',
      },
    ],
    expectedResult:
      'A fresh Chrome window appears with its own separate bookmarks, history, and theme color.',
    commonProblems: [
      {
        issue: 'I clicked the profile icon inside a website (like YouTube) instead of Chrome.',
        solution:
          'Look slightly higher up, near the address bar where website links appear, right below the window close button.',
      },
    ],
    learningTakeaway:
      'Profiles keep accounts tidy. You can switch between them anytime by clicking the same top-right circle.',
    tags: ['chrome', 'profile', 'browser', 'google', 'accounts'],
  },

  // 4. Windows Settings
  {
    id: 'make-text-bigger-scaling',
    title: 'Make screen text and icons bigger (Display Scaling)',
    category: 'Windows Settings',
    difficulty: 'Beginner',
    osContext: 'Windows 11',
    summary:
      'Enlarge text, buttons, and app windows so they are comfortable to read without straining your eyes.',
    prerequisites: 'Windows 11 Desktop.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open Windows Settings',
        instruction:
          'Press the Windows key + I on your keyboard to instantly open the Settings app.',
        actionType: 'shortcut',
        targetElement: 'Windows key + I',
      },
      {
        stepNumber: 2,
        title: 'Go to System > Display',
        instruction:
          'In Settings, click "System" on the left sidebar, then click "Display" on the right side.',
        actionType: 'click',
        targetElement: '"Display" row under System',
      },
      {
        stepNumber: 3,
        title: 'Locate the "Scale" setting',
        instruction:
          'Scroll down to the "Scale & layout" section. Look for the dropdown menu next to "Scale" (it often says 100% or 125%).',
        actionType: 'look',
        targetElement: '"Scale" dropdown menu',
      },
      {
        stepNumber: 4,
        title: 'Select a higher percentage',
        instruction:
          'Click the dropdown and select the next higher number (e.g., change 100% to 125%, or 125% to 150%). The screen will instantly rescale to larger text.',
        actionType: 'click',
        targetElement: 'Higher percentage option (e.g. 125% or 150%)',
      },
    ],
    expectedResult:
      'All text, menus, icons, and windows become noticeably larger and easier to read.',
    commonProblems: [
      {
        issue: 'Some text looks slightly blurry after changing.',
        solution:
          'Closing and reopening the open application, or restarting your computer, allows all apps to adapt smoothly to the new scaling.',
      },
    ],
    learningTakeaway:
      'Display scaling enlarges everything proportionally, making your high-resolution screen comfortable for daily reading.',
    tags: ['text size', 'scaling', 'display', 'accessibility', 'settings'],
  },
  {
    id: 'uninstall-unneeded-app',
    title: 'Uninstall an application you no longer need',
    category: 'Windows Settings',
    difficulty: 'Beginner',
    osContext: 'Windows 11',
    summary:
      'Free up disk storage and keep your laptop fast by safely removing apps you do not use.',
    prerequisites: 'Windows 11.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open Installed Apps settings',
        instruction:
          'Right-click the Windows Start button on the taskbar, then click "Installed apps" (or "Apps and Features").',
        actionType: 'right_click',
        targetElement: 'Windows Start button > Installed apps',
      },
      {
        stepNumber: 2,
        title: 'Find the app in the list',
        instruction:
          'Use the search box at the top of the list or scroll down alphabetically to locate the app you wish to delete.',
        actionType: 'type',
        targetElement: 'Search box in Installed apps',
      },
      {
        stepNumber: 3,
        title: 'Click the three dots beside the app',
        instruction:
          'On the far right side of that app\'s row, click the three horizontal dots (...).',
        actionType: 'click',
        targetElement: 'Three dots menu next to app name',
      },
      {
        stepNumber: 4,
        title: 'Click "Uninstall"',
        instruction:
          'Click "Uninstall". A small confirmation prompt will appear—click "Uninstall" again.',
        actionType: 'click',
        targetElement: '"Uninstall" button',
      },
    ],
    expectedResult:
      'The application and its files are cleanly erased from your system.',
    commonProblems: [
      {
        issue: 'Can I just drag the app icon into the Recycle Bin to uninstall it?',
        solution:
          'No. Dragging an icon to the Recycle Bin only deletes the desktop shortcut. The program remains fully installed on your hard drive.',
      },
    ],
    learningTakeaway:
      'Always uninstall through Windows Settings so all background registry entries and hidden files are removed.',
    tags: ['uninstall', 'remove', 'delete app', 'clean disk', 'storage'],
  },

  // 5. Devices and Connectivity
  {
    id: 'connect-bluetooth-headphones',
    title: 'Connect Bluetooth headphones or wireless earbuds',
    category: 'Devices and Connectivity',
    difficulty: 'Beginner',
    osContext: 'Windows 11',
    summary:
      'Pair your wireless headphones or Bluetooth speaker to your laptop for private audio.',
    prerequisites: 'Have your headphones charged and nearby.',
    steps: [
      {
        stepNumber: 1,
        title: 'Put headphones into Pairing Mode',
        instruction:
          'On your headphones or earbuds case, press and hold the power/Bluetooth button for 3-5 seconds until a small light blinks rapidly or a voice says "Pairing".',
        actionType: 'look',
        targetElement: 'Bluetooth button on headphones',
      },
      {
        stepNumber: 2,
        title: 'Open Windows Bluetooth Settings',
        instruction:
          'Press Windows Key + I to open Settings, then click "Bluetooth & devices" on the left menu.',
        actionType: 'click',
        targetElement: '"Bluetooth & devices" in Settings',
      },
      {
        stepNumber: 3,
        title: 'Click "Add device"',
        instruction:
          'Click the large "+ Add device" button near the top of the window.',
        actionType: 'click',
        targetElement: '"+ Add device" button',
      },
      {
        stepNumber: 4,
        title: 'Choose "Bluetooth"',
        instruction:
          'In the popup window, click the top option: "Bluetooth (Mice, keyboards, pens, audio)".',
        actionType: 'click',
        targetElement: '"Bluetooth" device type',
      },
      {
        stepNumber: 5,
        title: 'Select your headphones',
        instruction:
          'Wait a few seconds for the list to populate. When your headphone name appears, click it. Windows will say "Your device is ready to go!"',
        actionType: 'click',
        targetElement: 'Your headphone device name in the list',
      },
    ],
    expectedResult:
      'Your headphones chime and sound from your laptop will immediately play through your earbuds.',
    commonProblems: [
      {
        issue: 'My headphones are already paired with my phone and will not show up.',
        solution:
          'Temporarily turn off Bluetooth on your phone so your headphones are free to pair with your laptop.',
      },
    ],
    learningTakeaway:
      'Bluetooth requires "Pairing Mode" the first time. Afterwards, they reconnect automatically whenever turned on.',
    tags: ['bluetooth', 'headphones', 'earbuds', 'audio', 'sound'],
  },

  // 6. Documents and Productivity
  {
    id: 'extract-unzip-folder',
    title: 'Extract (Unzip) files from a ZIP archive',
    category: 'Documents and Productivity',
    difficulty: 'Beginner',
    osContext: 'Windows 11 / 10',
    summary:
      'Unpack compressed .zip archives downloaded from school or work so you can view, edit, and run the files inside.',
    prerequisites: 'A .zip file downloaded to your computer.',
    steps: [
      {
        stepNumber: 1,
        title: 'Locate the ZIP file',
        instruction:
          'Open File Explorer and navigate to where the file is (usually in your "Downloads" folder). It will have a zipper icon on the folder.',
        actionType: 'look',
        targetElement: 'Folder icon with a zipper',
      },
      {
        stepNumber: 2,
        title: 'Right-click the ZIP file',
        instruction:
          'Right-click the zipped folder with your mouse to bring up the context menu.',
        actionType: 'right_click',
        targetElement: 'Zipped folder context menu',
      },
      {
        stepNumber: 3,
        title: 'Click "Extract All..."',
        instruction:
          'Click the option labeled "Extract All..." (it has a folder icon with an arrow).',
        actionType: 'click',
        targetElement: '"Extract All..." option',
      },
      {
        stepNumber: 4,
        title: 'Confirm extraction location',
        instruction:
          'A dialog box will open showing where the extracted files will go. Leave the checkbox "Show extracted files when complete" checked, and click "Extract".',
        actionType: 'click',
        targetElement: '"Extract" button at bottom right',
      },
    ],
    expectedResult:
      'A regular yellow folder opens containing all the uncompressed files, fully editable.',
    commonProblems: [
      {
        issue: 'Why can\'t I just double-click the ZIP file?',
        solution:
          'Double-clicking lets you preview files, but many apps cannot save changes or run properly from inside a compressed archive. Always click "Extract All" first.',
      },
    ],
    learningTakeaway:
      'ZIP files compress multiple items into one download. Extracting unpacks them into normal, workable files.',
    tags: ['zip', 'unzip', 'extract', 'archive', 'compressed'],
  },
  {
    id: 'find-downloaded-files',
    title: 'Find where your downloaded documents and files went',
    category: 'Documents and Productivity',
    difficulty: 'First-time User',
    osContext: 'Windows 11 / 10',
    summary:
      'Locate downloaded PDFs, images, or documents that vanished after you clicked download.',
    prerequisites: 'You have downloaded a file recently.',
    steps: [
      {
        stepNumber: 1,
        title: 'Open File Explorer',
        instruction:
          'Look at the bottom taskbar of your screen and click the yellow folder icon (File Explorer). You can also press Windows Key + E.',
        actionType: 'click',
        targetElement: 'Yellow folder icon on Windows Taskbar',
      },
      {
        stepNumber: 2,
        title: 'Click "Downloads" in the sidebar',
        instruction:
          'In the left sidebar of the File Explorer window, locate and click the folder labeled "Downloads" (it often has a blue downward arrow icon).',
        actionType: 'click',
        targetElement: '"Downloads" folder in left navigation pane',
      },
      {
        stepNumber: 3,
        title: 'Sort by newest',
        instruction:
          'If you see many files, click the "Sort" button near the top toolbar, then choose "Date modified" and "Newest on top".',
        actionType: 'click',
        targetElement: 'Sort menu > Date modified > Newest',
      },
    ],
    expectedResult:
      'You will see your recent downloads arranged with the newest file right at the top.',
    commonProblems: [
      {
        issue: 'I do not see the yellow folder icon on my taskbar.',
        solution:
          'Press the Windows key on your keyboard, type "Downloads", and press Enter.',
      },
    ],
    learningTakeaway:
      'Almost all web browsers save files into your user "Downloads" folder by default unless you choose a different spot.',
    tags: ['downloads', 'find file', 'folder', 'explorer', 'lost file'],
  },

  // 7. Programming and Development
  {
    id: 'setup-vs-code',
    title: 'Install Visual Studio Code and open your first project folder',
    category: 'Programming and Development',
    difficulty: 'Beginner',
    osContext: 'Windows 11 / 10 / macOS',
    summary:
      'Set up the world standard code editor cleanly and learn how to properly open a folder as a project workspace.',
    prerequisites: 'Internet access and web browser.',
    steps: [
      {
        stepNumber: 1,
        title: 'Download VS Code installer',
        instruction:
          'Open your web browser, navigate to code.visualstudio.com, and click the blue "Download for Windows" button.',
        actionType: 'click',
        targetElement: '"Download for Windows" button on code.visualstudio.com',
      },
      {
        stepNumber: 2,
        title: 'Run installer with "Add to PATH" checked',
        instruction:
          'Open the downloaded setup file from your Downloads folder. During the setup wizard, ensure "Add to PATH" and "Add \'Open with Code\' action" are checked, then click Install.',
        actionType: 'click',
        targetElement: 'Setup wizard checkboxes and Install button',
        tip: 'Checking "Add to PATH" is critical so you can type "code ." in your terminal anytime!',
      },
      {
        stepNumber: 3,
        title: 'Create a dedicated coding folder',
        instruction:
          'Open File Explorer, go to your Documents folder, and create a new folder named "MyProjects".',
        actionType: 'type',
        targetElement: 'New folder in Documents',
      },
      {
        stepNumber: 4,
        title: 'Open the folder inside VS Code',
        instruction:
          'Launch Visual Studio Code. In the top menu bar, click "File" > "Open Folder...", navigate to your "MyProjects" folder, and click "Select Folder".',
        actionType: 'click',
        targetElement: 'File > Open Folder...',
      },
    ],
    expectedResult:
      'VS Code opens with your folder shown in the left Explorer pane, ready for creating files with the "New File" icon.',
    commonProblems: [
      {
        issue: 'VS Code asks: "Do you trust the authors of the files in this folder?"',
        solution:
          'Because you created this folder on your own laptop, click "Yes, I trust the authors".',
      },
    ],
    learningTakeaway:
      'In coding, always open an entire *folder* in your editor, not just individual isolated files. This gives your editor project context.',
    tags: ['vscode', 'code editor', 'programming', 'developer', 'workspace'],
  },
  {
    id: 'run-python-script',
    title: 'Install Python and run your first script from the terminal',
    category: 'Programming and Development',
    difficulty: 'Beginner',
    osContext: 'Windows 11 / 10',
    summary:
      'Install the official Python interpreter, verify it from the terminal, and execute a simple program.',
    prerequisites: 'Windows 11.',
    steps: [
      {
        stepNumber: 1,
        title: 'Download official Python installer',
        instruction:
          'Visit python.org/downloads and download the latest Python release for Windows.',
        actionType: 'click',
        targetElement: 'Python download button',
      },
      {
        stepNumber: 2,
        title: 'CRITICAL: Check "Add python.exe to PATH"',
        instruction:
          'Run the installer. Before clicking Install, check the small box at the bottom that says "Add python.exe to PATH". Then click "Install Now".',
        actionType: 'click',
        targetElement: '"Add python.exe to PATH" checkbox',
        tip: 'If you skip checking PATH, typing "python" in the terminal will fail or open the Microsoft Store!',
      },
      {
        stepNumber: 3,
        title: 'Open Windows Terminal or PowerShell',
        instruction:
          'Right-click your Start button and choose "Terminal" (or press Win + X then tap I).',
        actionType: 'click',
        targetElement: 'Windows Terminal from Win+X menu',
      },
      {
        stepNumber: 4,
        title: 'Verify Python version',
        instruction:
          'Type "python --version" (without quotes) and press Enter. It should print something like "Python 3.12.x".',
        actionType: 'type',
        targetElement: 'Terminal prompt: python --version',
      },
      {
        stepNumber: 5,
        title: 'Run a one-line test command',
        instruction:
          'Type: python -c "print(\'Hello DeskSense!\')" and press Enter. You will see your greeting printed right below.',
        actionType: 'type',
        targetElement: 'Terminal prompt',
      },
    ],
    expectedResult:
      'Python successfully responds in the terminal, confirming your developer environment is ready.',
    commonProblems: [
      {
        issue: 'Typing python opens the Microsoft Store instead of running Python.',
        solution:
          'Run the installer again, choose "Modify", and check "Add Python to environment variables / PATH". Then close and restart your terminal.',
      },
    ],
    learningTakeaway:
      'The PATH environment variable teaches your operating system where command-line tools live so you can run them from any folder.',
    tags: ['python', 'terminal', 'coding', 'script', 'path'],
  },
  {
    id: 'basic-git-clone-commit',
    title: 'Understand basic Git workflow (Clone, Status, Commit)',
    category: 'Programming and Development',
    difficulty: 'Intermediate',
    osContext: 'Windows 11 / macOS / Linux',
    summary:
      'Demystify Git version control: what a repository is, how to clone safely, and how to track your code changes.',
    prerequisites: 'Git installed and terminal open.',
    steps: [
      {
        stepNumber: 1,
        title: 'Check Git installation',
        instruction:
          'In your terminal, type "git --version" and press Enter. It should output your installed git version.',
        actionType: 'type',
        targetElement: 'Terminal prompt: git --version',
      },
      {
        stepNumber: 2,
        title: 'Understand "git status"',
        instruction:
          'Inside any project folder, type "git status". This safe command tells you which files you modified, added, or deleted without changing anything.',
        actionType: 'type',
        targetElement: 'Terminal prompt: git status',
        tip: 'Remember: "git status" is 100% safe to run anytime! It will never delete or overwrite your code.',
      },
      {
        stepNumber: 3,
        title: 'Stage changes with "git add"',
        instruction:
          'To prepare a file for saving in history, type "git add <filename>" (or "git add ." to stage all changed files in this folder).',
        actionType: 'type',
        targetElement: 'Terminal prompt: git add .',
      },
      {
        stepNumber: 4,
        title: 'Save snapshot with "git commit"',
        instruction:
          'Type git commit -m "Describe your change here" and press Enter. This creates a permanent, restorable milestone in your project history.',
        actionType: 'type',
        targetElement: 'Terminal prompt: git commit -m "message"',
      },
    ],
    expectedResult:
      'Git records your changes cleanly in history with an informative commit hash.',
    commonProblems: [
      {
        issue: 'Git prompts: "Please tell me who you are" (Author identity unknown).',
        solution:
          'Run git config --global user.name "Your Name" and git config --global user.email "your.email@example.com".',
      },
    ],
    learningTakeaway:
      'Git is like a time machine for your codebase. "git status" inspects the present, "git add" selects changes, and "git commit" saves the checkpoint.',
    tags: ['git', 'version control', 'commit', 'github', 'programming'],
  },

  // 8. Troubleshooting
  {
    id: 'force-close-frozen-app',
    title: 'Safely close an app that has frozen or is not responding',
    category: 'Troubleshooting',
    difficulty: 'Beginner',
    osContext: 'Windows 11 / 10',
    summary:
      'Stop a program that is stuck or spinning without having to pull the battery or power off your computer.',
    prerequisites: 'An application is frozen or saying "(Not Responding)".',
    steps: [
      {
        stepNumber: 1,
        title: 'Open Task Manager with keyboard shortcut',
        instruction:
          'Press and hold three keys simultaneously: Ctrl + Shift + Esc. Task Manager will immediately open.',
        actionType: 'shortcut',
        targetElement: 'Ctrl + Shift + Esc shortcut keys',
        tip: 'If your keyboard does not respond, press Ctrl + Alt + Delete and choose "Task Manager" from the blue screen.',
      },
      {
        stepNumber: 2,
        title: 'Find the frozen app in the list',
        instruction:
          'In Task Manager under the "Processes" tab, look down the list of "Apps" to find the one that is frozen. It often has "(Not responding)" beside its name.',
        actionType: 'look',
        targetElement: 'Apps list in Task Manager',
      },
      {
        stepNumber: 3,
        title: 'Select the app',
        instruction:
          'Click once on the frozen app to highlight it in blue.',
        actionType: 'click',
        targetElement: 'Frozen app line item',
      },
      {
        stepNumber: 4,
        title: 'Click "End task"',
        instruction:
          'Click the "End task" button located in the top-right corner of Task Manager (or right-click the app and choose "End task").',
        actionType: 'click',
        targetElement: '"End task" button',
      },
    ],
    expectedResult:
      'Windows forcefully shuts down the stuck program, freeing up your computer memory.',
    commonProblems: [
      {
        issue: 'Will ending task lose unsaved work in that document?',
        solution:
          'Yes, if the program was frozen, unsaved changes might be lost. However, modern apps keep auto-recover backups when you reopen.',
      },
    ],
    learningTakeaway:
      'Task Manager (Ctrl + Shift + Esc) is the control room for Windows when any software misbehaves.',
    tags: ['freeze', 'crash', 'not responding', 'task manager', 'end task'],
  },
  {
    id: 'fix-no-sound-troubleshoot',
    title: 'Fix missing sound or muted audio',
    category: 'Troubleshooting',
    difficulty: 'First-time User',
    osContext: 'Windows 11',
    summary:
      'Step-by-step check to fix why no sound is coming out of your laptop speakers or connected earphones.',
    prerequisites: 'Audio is not playing as expected.',
    steps: [
      {
        stepNumber: 1,
        title: 'Check the speaker icon on the taskbar',
        instruction:
          'Look at the bottom-right corner of your screen. Does the speaker icon have a small "X" next to it?',
        actionType: 'look',
        targetElement: 'Bottom-right speaker icon',
      },
      {
        stepNumber: 2,
        title: 'Click the speaker/volume group',
        instruction:
          'Click the speaker icon to open the Quick Settings panel.',
        actionType: 'click',
        targetElement: 'Volume icon / slider',
      },
      {
        stepNumber: 3,
        title: 'Unmute and raise volume',
        instruction:
          'If the speaker icon on the left of the slider has an X, click it to unmute. Drag the volume slider to the right (aim for 50-70%).',
        actionType: 'drag',
        targetElement: 'Volume slider bar',
      },
      {
        stepNumber: 4,
        title: 'Check audio output device',
        instruction:
          'Click the small arrow (>) on the right end of the volume slider. This opens the list of audio outputs. Make sure "Speakers (Realtek Audio)" or your headphones are selected with a checkmark.',
        actionType: 'click',
        targetElement: 'Output device selection arrow (>)',
        tip: 'Often sound is going to an external monitor or disconnected device by mistake.',
      },
    ],
    expectedResult:
      'Sound plays cleanly through your intended speakers or earphones.',
    commonProblems: [
      {
        issue: 'Sound still is not working on YouTube or a video.',
        solution:
          'Check the video player itself. Web video players (YouTube, Netflix) have their own separate volume slider and mute button on screen.',
      },
    ],
    learningTakeaway:
      'Sound has three gates: the web video slider, the Windows master volume, and the selected output device.',
    tags: ['sound', 'audio', 'mute', 'speakers', 'volume'],
  },
  {
    id: 'restart-computer-safely',
    title: 'Restart your computer safely',
    category: 'Troubleshooting',
    difficulty: 'First-time User',
    osContext: 'Windows 11 / 10',
    summary:
      'A clean restart resolves 80% of temporary glitches, sluggishness, and Wi-Fi dropouts.',
    prerequisites: 'Save any open documents before proceeding.',
    steps: [
      {
        stepNumber: 1,
        title: 'Save your open work',
        instruction:
          'Check any open Word documents, notes, or browser drafts and save them (Ctrl + S).',
        actionType: 'look',
        targetElement: 'Open documents',
      },
      {
        stepNumber: 2,
        title: 'Click the Windows Start button',
        instruction:
          'Click the Windows logo button in the bottom taskbar.',
        actionType: 'click',
        targetElement: 'Windows Start button',
      },
      {
        stepNumber: 3,
        title: 'Click the Power icon',
        instruction:
          'In the lower-right corner of the Start menu, click the circular Power button symbol.',
        actionType: 'click',
        targetElement: 'Circular Power icon',
      },
      {
        stepNumber: 4,
        title: 'Select "Restart"',
        instruction:
          'Click "Restart" (not "Shut down"). The computer will cleanly close all background services, reboot, and welcome you back.',
        actionType: 'click',
        targetElement: '"Restart" option',
        tip: 'In Windows 11, "Shut down" uses Fast Startup which preserves saved kernel state, whereas "Restart" gives a completely fresh memory boot.',
      },
    ],
    expectedResult:
      'The laptop cycles off and on cleanly, refreshing system memory and resolving sluggish behavior.',
    commonProblems: [
      {
        issue: 'An app asks "Do you want to save changes?" during restart.',
        solution:
          'Click "Save" so your latest words or files are preserved.',
      },
    ],
    learningTakeaway:
      'In modern Windows, "Restart" provides a cleaner memory flush than "Shut down". Use it whenever your computer feels laggy.',
    tags: ['restart', 'reboot', 'slow', 'freeze', 'troubleshooting'],
  },
];
