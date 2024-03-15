) {
            toggleSelection(currentIndex);
        }
    });
    const toggleSelection = (index) => {
        const selectedIndex = selectedItems.indexOf(index);
        if (selectedIndex > -1) {
            setSelectedItems(selectedItems.filter((i) => i !== index));
        }
        else {
            setSelectedItems([...selectedItems, index]);
        }
    };
    const getFilesAndFolders = (selectedItems) => {
        const outputItems = [];
        let fileCount = 0;
        for (const index of selectedItems) {
            const item = items[index];
            if (item) {
                const itemPath = path.join(process.cwd(), item);
                if (fs.statSync(itemPath).isDirectory()) {
                    outputItems.push(`## dir '${item}'\n`);
                    const { files, count } = getFilesInDirectory(itemPath);
                    outputItems.push(...files);
                    fileCount += count;
                }
                else {
                    const content = fs.readFileSync(itemPath, 'utf8');
                    outputItems.push(`## file '${item}'\n\`\`\`\n${content}\`\`\`\n`);
                    fileCount++;
                }
            }
        }
        return { output: outputItems.join('\n'), fileCount };
    };
    const getFilesInDirectory = (dirPath) => {
        const files = [];
        let fileCount = 0;
        const dirItems = fs.readdirSync(dirPath);
        for (const item of dirItems) {
            const itemPath = path.join(dirPath, item);
            if (fs.statSync(itemPath).isDirectory()) {
                const { files: nestedFiles, count } = getFilesInDirectory(itemPath);
                files.push(...nestedFiles);
                fileCount += count;
            }
            else {
                const content = fs.readFileSync(itemPath, 'utf8');
                files.push(`## file '${itemPath}'\n\`\`\`\n${content}\`\`\`\n`);
                fileCount++;
            }
        }
        return { files, count: fileCount };
    };
    return (React.createElement(Box, { flexDirection: "column", marginTop: 2, marginBottom: 2 },
        React.createElement(Box, { flexDirection: "column", marginBottom: 1 },
            React.createElement(Text, null, "Select files and folders to include."),
            React.createElement(Text, null,
                "Search query: ",
                globalInput ? React.createElement(Text, { color: "cyan" }, globalInput) : React.createElement(Text, { color: "gray", italic: true }, "None"))),
        React.createElement(Box, { marginBottom: 1, flexDirection: "column" },
            items.map((item, index) => (React.createElement(Text, { key: item, color: index === currentIndex ? 'green' : selectedItems.includes(index) ? 'cyan' : undefined }, selectedItems.includes(index) ? `[${figures.tick}] ${item}` : `[ ] ${item}`))),
            items.length === 0 && React.createElement(Text, { color: "gray", italic: true }, "No directories/files matching search.")),
        React.createElement(Box, null,
            React.createElement(Text, null,
                "Use ",
                React.createElement(Text, { color: "green" }, "Up"),
                " / ",
                React.createElement(Text, { color: "green" }, "Down"),
                " to navigate, ",
                React.createElement(Text, { color: "green" }, "Left"),
                " / ",
                React.createElement(Text, { color: "green" }, "Right"),
                " to select, and ",
                React.createElement(Text, { color: "green" }, "Enter"),
                " to proceed.")),
        message && (React.createElement(Box, { marginTop: 2 },
            React.createElement(Text, { color: "green" }, message)))));
};
export default App;
