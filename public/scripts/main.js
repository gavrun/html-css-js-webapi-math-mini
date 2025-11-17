'use strict';

// IIFE scope isolation and safety

(function () {
    // Constants
    const STORAGE_KEY = 'mathTrainer';
    const SKILLS = ['pre-school', 'school', 'high-school'];
    const TOPICS = ['arithmetic'];

    // Initialize app
    function initApp() {
        const data = loadData();

        // Mark visited pages 
        updatePageVisit();

        if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
            renderUserSection(data);

            if (data.currentUserId !== null) {
                renderTopics(data);
            }
        }
    }

    // Load data
    function loadData() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }

        // Initial structure
        return {
            currentUserId: null,
            users: []
        };
    }

    // Save data
    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // Render user section
    function renderUserSection(data) {
        const userSection = document.getElementById('userSection');
        if (!userSection) return;

        if (data.users.length === 0) {
            // Show create user form
            userSection.innerHTML = `
                <h2>Create user</h2>
                <form class="user-form" id="createUserForm">
                    <div class="form-group">
                        <label for="userName">Name *</label>
                        <input 
                            type="text" 
                            id="userName" 
                            name="name" 
                            required 
                            pattern="[A-Za-z\\s]+"
                            placeholder="Enter your name"
                            title="Only letters and space"
                        >
                    </div>
                    <div class="form-group">
                        <label for="userAge">Age *</label>
                        <input 
                            type="number" 
                            id="userAge" 
                            name="age" 
                            required 
                            min="1" 
                            max="99"
                            placeholder="Enter your age"
                        >
                    </div>
                    <div class="form-group">
                        <label for="userSkill">Grade *</label>
                        <select id="userSkill" name="skill" required>
                            <option value="">Select your grade</option>
                            ${SKILLS.map(skill => `<option value="${skill}">${skill}</option>`).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Create user</button>
                </form>
            `;

            document.getElementById('createUserForm').addEventListener('submit', handleCreateUser);
        } else {
            // Show user selector and create new button
            const currentUser = data.users.find(u => u.id === data.currentUserId);

            if (currentUser) {
                // Show selected user info
                const completedCount = calculateProgress(currentUser);
                userSection.innerHTML = `
                    <div class="user-info">
                        <div>
                            <h3>Hello, ${currentUser.name}!</h3>
                            <p>${currentUser.age} years • ${currentUser.skill}</p>
                        </div>
                        <div class="progress-info">
                            Progress: ${completedCount}/${TOPICS.length} topics completed
                        </div>
                    </div>
                    <button class="btn btn-secondary" id="changeUserBtn">Change user</button>
                `;

                document.getElementById('changeUserBtn').addEventListener('click', () => {
                    const updatedData = loadData();
                    updatedData.currentUserId = null;
                    saveData(updatedData);
                    location.reload();
                });
            } else {
                // Show user selector
                userSection.innerHTML = `
                    <h2>Select or create user</h2>
                    <div class="user-selector">
                        <div class="form-group">
                            <label for="userSelect">Existing users</label>
                            <select id="userSelect">
                                <option value="">-- Select user --</option>
                                ${data.users.map(u => `<option value="${u.id}">${u.name} (${u.age} years, ${u.skill})</option>`).join('')}
                            </select>
                        </div>
                        <button class="btn btn-primary" id="selectUserBtn">Select</button>
                    </div>
                    <hr style="margin: 2rem 0; border: none; border-top: 2px solid var(--light);">
                    <h3>Or create a new user</h3>
                    <form class="user-form" id="createUserForm">
                        <div class="form-group">
                            <label for="userName">Name *</label>
                            <input 
                                type="text" 
                                id="userName" 
                                name="name" 
                                required 
                                pattern="[A-Za-z\\s]+"
                                placeholder="Enter your name"
                                title="Only letters and space"
                            >
                        </div>
                        <div class="form-group">
                            <label for="userAge">Age *</label>
                            <input 
                                type="number" 
                                id="userAge" 
                                name="age" 
                                required 
                                min="1" 
                                max="99"
                                placeholder="Enter your age"
                            >
                        </div>
                        <div class="form-group">
                            <label for="userSkill">Grade *</label>
                            <select id="userSkill" name="skill" required>
                                <option value="">Select your grade</option>
                                ${SKILLS.map(skill => `<option value="${skill}">${skill}</option>`).join('')}
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Create user</button>
                    </form>
                `;

                document.getElementById('selectUserBtn').addEventListener('click', handleSelectUser);
                document.getElementById('createUserForm').addEventListener('submit', handleCreateUser);
            }
        }
    }

    // Generate UUID v4 for user
    function generateUserId() {
        if (crypto && crypto.randomUUID) {
            return crypto.randomUUID();
        }
        // Fallback logic
        return;
    }

    // Handle user creation
    function handleCreateUser(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = loadData();

        const newUser = {
            // id: generateUserId(),
            id: data.users.length > 0 ? Math.max(...data.users.map(u => u.id)) + 1 : 0,
            name: formData.get('name').trim(),
            age: parseInt(formData.get('age')),
            skill: formData.get('skill'),
            progress: {
                arithmetic: { theory: false, task: false }
            }
        };

        data.users.push(newUser);
        data.currentUserId = newUser.id;
        saveData(data);
        location.reload();
    }

    // Handle user selection
    function handleSelectUser() {
        const select = document.getElementById('userSelect');
        const userId = parseInt(select.value); // isNaN(userId)
        // const userId = select.value; // !userId

        if (isNaN(userId)) {
            // Notify user
            return;
        }

        const data = loadData();
        data.currentUserId = userId;
        saveData(data);
        location.reload();
    }

    // Calculate completed topics
    function calculateProgress(user) {
        let completed = 0;

        TOPICS.forEach(topic => {
            const progress = user.progress[topic];
            if (progress.theory && progress.task) {
                completed++;
            }
        });
        return completed;
    }

    // Render topics grid
    function renderTopics(data) {
        const topicsGrid = document.getElementById('topicsGrid');
        if (!topicsGrid) return; // TODO null check
        topicsGrid.style.display = 'block';

        const currentUser = data.users.find(u => u.id === data.currentUserId);
        if (!currentUser) return;

        // Update status badges
        TOPICS.forEach(topic => {
            const card = document.querySelector(`[data-topic="${topic}"]`);
            if (!card) return;
            const badge = card.querySelector('.status-badge');
            if (!badge) return;
            const progress = currentUser.progress[topic];

            if (progress.theory && progress.task) {
                badge.setAttribute('data-status', 'complete');
            } else {
                badge.setAttribute('data-status', 'incomplete');
            }
        });
    }

    // Update page
    function updatePageVisit() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);

        // Parse topic and page type from filename
        const match = filename.match(/^(\w+)-(theory|practice|visualization)\.html$/);
        if (!match) return;

        const topic = match[1];
        const pageType = match[2];

        const data = loadData();

        if (data.currentUserId === null) {
            // Notify user not selected 
            // Redirect to home
            window.location.href = 'index.html';
            return;
        }
        const currentUser = data.users.find(u => u.id === data.currentUserId);
        if (!currentUser || !currentUser.progress[topic]) return;

        // Mark theory as visited completed
        if (pageType === 'theory') {
            currentUser.progress[topic].theory = true;
        }
        // Mark task completion handled separetly

        saveData(data);
    }

    // Expose functions to global scope
    window.mathTrainer = {
        loadData,
        saveData,
        markTaskComplete: function (topic) {
            const data = loadData();
            const currentUser = data.users.find(u => u.id === data.currentUserId);
            if (currentUser && currentUser.progress[topic]) {
                currentUser.progress[topic].task = true;
                saveData(data);
            }
        }
    };

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();
