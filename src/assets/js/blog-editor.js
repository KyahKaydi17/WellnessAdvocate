import { db, storage } from './firebase-config.js';
import { collection, addDoc, serverTimestamp, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Initialize Quill editor
const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['link', 'image'],
            ['clean']
        ]
    }
});

// Handle form submission
document.getElementById('blogForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const title = document.getElementById('blogTitle').value;
        const content = quill.root.innerHTML;
        const categories = document.getElementById('blogCategories').value
            .split(',')
            .map(cat => cat.trim());
        
        // Handle image upload
        const imageFile = document.getElementById('blogImage').files[0];
        let imageUrl = '';
        
        if (imageFile) {
            const storageRef = ref(storage, `blog-images/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // Create blog post document
        const blogRef = await addDoc(collection(db, 'blog'), {
            title,
            content,
            imageUrl,
            categories,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        alert('Blog post created successfully!');
        window.location.href = 'index.html#blog';

    } catch (error) {
        console.error('Error creating blog post:', error);
        alert('Error creating blog post. Please try again.');
    }
});

// Image preview
document.getElementById('blogImage').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = `
                <img src="${e.target.result}" class="img-fluid mt-2" style="max-height: 200px">
            `;
        }
        reader.readAsDataURL(file);
    }
});

// Sample blog post data
const samplePost = {
    id: 'sample-post',
    title: '10 Essential Wellness Tips for a Healthy Lifestyle',
    content: `
        <h2>Living Your Best Life Through Wellness</h2>
        <p>In today's fast-paced world, maintaining good health and wellness is more important than ever. Here are 10 essential tips to help you achieve a balanced and healthy lifestyle:</p>
        
        <h3>1. Prioritize Quality Sleep</h3>
        <p>Aim for 7-9 hours of quality sleep each night to support your body's natural healing and rejuvenation processes.</p>

        <h3>2. Stay Hydrated</h3>
        <p>Drink at least 8 glasses of water daily to maintain proper bodily functions and energy levels.</p>

        <h3>3. Practice Mindful Eating</h3>
        <p>Focus on whole, nutrient-rich foods and practice mindful eating habits to support your overall health.</p>
    `,
    image: 'src/assets/images/wellness-sample.jpg',
    date: 'April 2, 2024',
    category: 'Wellness Tips'
};

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
    
    // Event listeners for edit and view buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.edit-post-btn')) {
            const postId = e.target.closest('.blog-post-card').dataset.postId;
            editPost(postId);
        }
        if (e.target.closest('.view-post-btn')) {
            const postId = e.target.closest('.blog-post-card').dataset.postId;
            viewPost(postId);
        }
    });
});

async function initializeBlog() {
    // Check if sample post exists in Firestore
    const querySnapshot = await getDocs(collection(db, 'blog'));
    if (querySnapshot.empty) {
        // Add sample post to Firestore
        try {
            await addDoc(collection(db, 'blog'), samplePost);
            console.log('Sample blog post added to Firestore');
        } catch (error) {
            console.error('Error adding sample post:', error);
        }
    }
}

function editPost(postId) {
    // Redirect to blog editor with post ID
    window.location.href = `blog-editor.html?id=${postId}`;
}

function viewPost(postId) {
    // Create modal for viewing post
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'blogPostModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${samplePost.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${samplePost.content}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Clean up modal when hidden
    modal.addEventListener('hidden.bs.modal', function () {
        modal.remove();
    });
}