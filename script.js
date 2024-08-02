document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/files')
        .then(response => response.json())
        .then(data => renderFileStructure(data))
        .catch(error => console.error('Error fetching file structure:', error));

    const directoryList = document.getElementById('directory-list');

    // Sample directory hierarchy data
    const directoryHierarchy = {
        name: 'root',
        children: [
            {
                name: 'folder1',
                children: [
                    {
                        name: 'file1.txt',
                        type: 'file'
                    },
                    {
                        name: 'folder2',
                        children: [
                            {
                                name: 'file2.txt',
                                type: 'file'
                            },
                            {
                                name: 'folder3',
                                children: [
                                    {
                                        name: 'file3.txt',
                                        type: 'file'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                name: 'file4.txt',
                type: 'file'
            },
            {
                name: 'folder5',
                children: [
                    {
                        name: 'file5.txt',
                        type: 'file'
                    }
                ]
            }
        ]
    };

    directoryHierarchy.children.forEach(child => {
        const childElement = renderDirectoryHierarchy(child);
        directoryList.appendChild(childElement);
    });
});

function renderFileStructure(files, parentElement = document.getElementById('fileList')) {
    parentElement.innerHTML = '';
    files.forEach(file => {
        const li = document.createElement('li');
        li.textContent = file.name;
        li.dataset.id = file.id;
      
        li.addEventListener('click', (e) => {
            if (directory.type === 'directory') {
                li.classList.toggle('expanded');
            }
            e.stopPropagation();
        });

        const renameButton = document.createElement('button');
        renameButton.textContent = 'Rename';
        renameButton.onclick = () => renameItem(file.id);
        li.appendChild(renameButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteItem(file.id);
        li.appendChild(deleteButton);

        if (file.type === 'directory') {
            const ul = document.createElement('ul');
            li.appendChild(ul);
            renderFileStructure(file.children, ul);
        }

        parentElement.appendChild(li);
    });
}

function createItem(type) {
    const name = prompt(`Enter name for new ${type}`);
    if (name) {
        fetch('/api/files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ type, name })
        })
        .then(response => response.json())
        .then(data => renderFileStructure(data))
        .catch(error => console.error('Error creating item:', error));
    }
}

function renameItem(id) {
    const newName = prompt('Enter new name');
    if (newName) {
        fetch(`/api/files/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newName })
        })
        .then(response => response.json())
        .then(data => renderFileStructure(data))
        .catch(error => console.error('Error renaming item:', error));
    }
}

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        fetch(`/api/files/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => renderFileStructure(data))
        .catch(error => console.error('Error deleting item:', error));
    }
}

function renderDirectoryHierarchy(directory) {
    const directoryElement = document.createElement('li');
    directoryElement.textContent = directory.name;
    directoryElement.classList.add(directory.type === 'file' ? 'file' : 'folder');

    if (directory.children) {
        const childrenElement = document.createElement('ul');
        directoryElement.appendChild(childrenElement);

        directory.children.forEach(child => {
            const childElement = renderDirectoryHierarchy(child);
            childrenElement.appendChild(childElement);
        });
    }

    directoryElement.addEventListener('click', () => {
        if (directoryElement.classList.contains('folder')) {
            directoryElement.classList.toggle('expanded');
        }
    });

    return directoryElement;
}
