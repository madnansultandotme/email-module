# Email API Module

This module provides a backend service for handling email submissions from a contact form and sending them using Gmail SMTP via Nodemailer. It's designed to be deployable as a serverless function on Vercel.

## 🌟 Features

- **Express.js Server** for local development
- **Nodemailer with Gmail SMTP** for sending emails
- **Environment Variables** for secure configuration
- **Professional Email Templates** featuring your branding
- **CORS support** for frontend integration

## 🚀 Quick Start

### Prerequisites

- Node.js (>= 18.x)
- NPM
- Gmail Account with App Password
- Vercel CLI (for deployment)

### Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone [repository-url]
   cd email-module
   npm install
   ```

2. Create a `.env` file based on `.env.example` and update it with your credentials:
   ```plaintext
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@example.com
   ```

3. Start the local development server:
   ```bash
   npm start
   ```

## 📬 Frontend Integration

### API Endpoint

**URL:** `https://your-vercel-deployment-url/api/send-email`  
**Method:** `POST`  
**Content-Type:** `application/json`

### Request Body

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "subject": "Hello World",
  "message": "This is a test message from the contact form."
}
```

### Response Format

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Email sent successfully!",
  "messageId": "<message-id>"
}
```

**Error Response (400/500):**
```json
{
  "error": "Missing required fields. Please provide name, email, subject, and message."
}
```

### 🟡 Vanilla JavaScript

```javascript
const submitContactForm = async (formData) => {
  try {
    const response = await fetch('https://your-vercel-deployment-url/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Email sent successfully:', result.message);
      return { success: true, data: result };
    } else {
      console.error('❌ Email sending failed:', result.error);
      return { success: false, error: result.error };
    }
  } catch (err) {
    console.error('🚨 Network error:', err);
    return { success: false, error: 'Network error occurred' };
  }
};

// Example usage:
const formData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  subject: 'Hello World',
  message: 'This is a test message from the contact form.'
};

submitContactForm(formData).then(result => {
  if (result.success) {
    alert('Message sent successfully!');
  } else {
    alert('Error: ' + result.error);
  }
});
```

### ⚛️ React Integration

```jsx
import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://your-vercel-deployment-url/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: result.error });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
        />
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
      
      {submitStatus && (
        <div className={`status ${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}
    </form>
  );
};

export default ContactForm;
```

### 🟢 Vue.js Integration

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="name">Name:</label>
      <input
        type="text"
        id="name"
        v-model="formData.name"
        required
      />
    </div>
    
    <div>
      <label for="email">Email:</label>
      <input
        type="email"
        id="email"
        v-model="formData.email"
        required
      />
    </div>
    
    <div>
      <label for="subject">Subject:</label>
      <input
        type="text"
        id="subject"
        v-model="formData.subject"
        required
      />
    </div>
    
    <div>
      <label for="message">Message:</label>
      <textarea
        id="message"
        v-model="formData.message"
        required
      />
    </div>
    
    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Sending...' : 'Send Message' }}
    </button>
    
    <div v-if="submitStatus" :class="`status ${submitStatus.type}`">
      {{ submitStatus.message }}
    </div>
  </form>
</template>

<script>
export default {
  name: 'ContactForm',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      isSubmitting: false,
      submitStatus: null
    };
  },
  methods: {
    async handleSubmit() {
      this.isSubmitting = true;
      this.submitStatus = null;

      try {
        const response = await fetch('https://your-vercel-deployment-url/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });

        const result = await response.json();

        if (response.ok) {
          this.submitStatus = { type: 'success', message: 'Message sent successfully!' };
          this.formData = { name: '', email: '', subject: '', message: '' };
        } else {
          this.submitStatus = { type: 'error', message: result.error };
        }
      } catch (error) {
        this.submitStatus = { type: 'error', message: 'Network error occurred' };
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
```

### 🔷 Angular Integration

```typescript
// contact-form.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
  isSubmitting = false;
  submitStatus: { type: string; message: string } | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.isSubmitting = true;
    this.submitStatus = null;

    this.http.post('https://your-vercel-deployment-url/api/send-email', this.formData)
      .subscribe({
        next: (response: any) => {
          this.submitStatus = { type: 'success', message: 'Message sent successfully!' };
          this.formData = { name: '', email: '', subject: '', message: '' };
          this.isSubmitting = false;
        },
        error: (error) => {
          this.submitStatus = { 
            type: 'error', 
            message: error.error?.error || 'Network error occurred' 
          };
          this.isSubmitting = false;
        }
      });
  }
}
```

### 🎯 jQuery Integration

```javascript
$(document).ready(function() {
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    
    const formData = {
      name: $('#name').val(),
      email: $('#email').val(),
      subject: $('#subject').val(),
      message: $('#message').val()
    };
    
    // Show loading state
    $('#submitBtn').prop('disabled', true).text('Sending...');
    $('#status').empty();
    
    $.ajax({
      url: 'https://your-vercel-deployment-url/api/send-email',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(response) {
        $('#status').html('<div class="success">Message sent successfully!</div>');
        $('#contactForm')[0].reset();
      },
      error: function(xhr) {
        const errorMsg = xhr.responseJSON?.error || 'Network error occurred';
        $('#status').html('<div class="error">Error: ' + errorMsg + '</div>');
      },
      complete: function() {
        $('#submitBtn').prop('disabled', false).text('Send Message');
      }
    });
  });
});
```

## 🚀 Deployment

Deploy the backend as a serverless function to Vercel:

```bash
vercel deploy
```

## 📚 Documentation

- **Environment Variables:** Store sensitive information securely with Environment Variables.
- **Nodemailer:** Use to set up email sending configurations.
- **Express:** Utilized for handling HTTP requests in development.
- **CORS:** Enabled for integration with frontend applications.

## 🔧 Troubleshooting

- **Invalid JSON Body Errors:** Ensure requests contain valid JSON and specify `Content-Type: application/json`.
- **Authentication Failed Errors:** Verify Gmail credentials and App Password settings.

## ⚙️ Contributing

Feel free to submit issues or pull requests for improvements!
