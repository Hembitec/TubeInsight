
### *npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias @/ --no-turbo

---

### **Page Structure**

#### 1. **Landing Page**
- **Purpose**: Introduce the app, highlight features, and invite users to sign up or log in.
- **Features**:
  - A hero section with a tagline like: *"Extract Insights, Save Time, Learn Smarter."*
  - Call-to-action buttons: "Sign Up" or "Log In."
  - Brief overview of key features (summaries, educational content, research insights).
  - Testimonials or a "How It Works" section.

#### 2. **Authentication Page (Login/Sign-Up)**
- **Purpose**: Allow users to authenticate and access their dashboard.
- **Features**:
  - Login with email/password.
  - Password recovery option.
  - Separate tabs or forms for login and sign-up.

#### 3. **Dashboard**
- **Purpose**: Central hub where users manage analyses and access app features.
- **Features**:
  - List of analyzed videos with timestamps and quick actions (view, reanalyze, delete).
  - Button to start a new analysis (opens input modal or form).
  - Subscription status and account settings (e.g., upgrade plan).

#### 4. **Results Page**
- **Purpose**: Display analysis results and preview for a selected video.
- **Features**:
  - Sections for:
    - Video preview (thumbnail, title, duration, likes, views, date).
    - Summaries (executive, text, key takeaways, bullet points).
    - Educational content (quizzes, flashcards, study notes, terminologies).
    - Research analysis (gaps, quality, further research, bias).
  - Download/Share results button.

#### 5. **Subscription Page**
- **Purpose**: Manage and upgrade user subscription plans.
- **Features**:
  - Display current subscription tier and benefits.
  - Stripe integration for payment processing.

#### 6. **Support Page**
- **Purpose**: Provide help and resources for users.
- **Features**:
  - FAQs and troubleshooting guides.
  - Contact form for direct support.
  - Links to documentation or tutorials.

---

### **Phase 1: Understanding the User Flow**

1. User visits the **Landing Page** and clicks "Sign Up" or "Log In."
2. Authentication takes them to the **Dashboard**, where they can:
   - View their analysis history.
   - Start a new analysis.
   - Manage their subscription and account settings.
3. Selecting a video opens the **Results Page** with detailed insights.
4. Users can upgrade their plan via the **Subscription Page** or get help on the **Support Page**.

---

### **Phase 2: Technical Planning**

#### **Frontend (React.js or Next.js)**
- **Pages**: Landing Page, Auth Page, Dashboard, Results Page, Subscription Page, Support Page.
- **Libraries**:
  - Tailwind CSS or Material-UI for styling.
  - React Router for navigation.
  - Supabase Auth SDK for user authentication.

#### **Backend (FastAPI or Supabase Functions)**
- **Endpoints**:
  - `/auth`: Handles user login/signup.
  - `/analyze`: Processes video URL and returns results.
  - `/results`: Fetches stored results for a video.
  - `/subscription`: Manages subscription tiers and payments.

#### **Database (Supabase)**
- Tables for users, videos, and analysis results (as defined earlier).

#### **APIs**
- **YouTube Data API**: Fetch video transcripts.
- **Google Gemini 1.5 Pro**: Perform AI-powered analysis.
- **Stripe**: Handle payments and subscriptions.

---

### **Phase 3: Step-by-Step Implementation**

#### **Step 1: Landing Page**
**What We're Doing**: Create a welcoming page to attract users.

**Tasks**:
1. Design a responsive landing page using React and Tailwind CSS.
2. Add CTAs ("Sign Up" and "Log In") linked to the auth page.
3. Include sections for:
   - App introduction.
   - Key features (with icons or illustrations).
   - Testimonials or success stories.
   - Footer with links to Terms of Service and Privacy Policy.

**How to Test**:
- Check responsiveness on desktop and mobile devices.
- Validate that CTA buttons redirect to the auth page.

---

#### **Step 2: Authentication Page**
**What We're Doing**: Enable secure login and sign-up.

**Tasks**:
1. Set up Supabase Auth for:
   - Email/password login.
   - Google OAuth.
2. Create forms for login and sign-up, with form validation.
3. Add password reset functionality.

**How to Test**:
- Test authentication flows (sign-up, login, logout).
- Validate that incorrect credentials trigger error messages.

---

#### **Step 3: Dashboard**
**What We're Doing**: Create a hub for managing video analyses.

**Tasks**:
1. Fetch and display a list of user-analyzed videos from Supabase.
2. Add a button to start a new analysis:
   - Open a modal or form for inputting a YouTube URL.
   - Send the URL to the backend for processing.
3. Include user subscription status and settings.

**How to Test**:
- Test data retrieval and display (e.g., video titles, timestamps).
- Validate that clicking "Analyze" initiates processing.

---

#### **Step 4: Results Page**
 Display the preview of all the analysed video and make sure theres no duplicate if one video is anal

**Tasks**:
1. Design interactive results page with video preview and sections for:
**Summaries**
Executive Summary
Text Summary
Key Takeaways
Bullet Points
**Educational Content**
Quiz
Flash Cards
Study Notes
Terminologies
**Research Analysis**
Research Gaps
Research Quality
Further Research
Bias Analysis
2. Add functionality to download results as a PDF.
3. Include navigation back to the dashboard.

**How to Test**:
- Validate that results display correctly for various analyses.
- Ensure download and share features work.

---

#### **Step 5: Subscription Page**
**What We're Doing**: Allow users to manage plans.

**Tasks**:
1. Use Supabase’s Stripe integration to sync subscription data.
2. Display current plan and upgrade options.
3. Add payment functionality via Stripe.

**How to Test**:
- Test plan upgrades/downgrades in Stripe’s test mode.
- Validate that subscription status updates in the dashboard.

---

#### **Step 6: Support Page**
**What We're Doing**: Provide resources and assistance.

**Tasks**:
1. Create an FAQ section with collapsible questions.
2. Add a contact form linked to Supabase or an email service.
3. Include links to tutorials or documentation.

**How to Test**:
- Verify that the contact form submits successfully.
- Ensure FAQ content is clear and accessible.

---

#### **Step 7: Deployment**
**What We're Doing**: Launch EduExtract for public use.

**Tasks**:
1. Deploy frontend on Vercel or Netlify.
2. Deploy backend (Supabase Functions or Google Cloud).
3. Link to a custom domain and enable SSL.

**How to Test**:
- Test the live app for end-to-end functionality.
- Monitor for issues using analytics and error logs.

---

### **Final Checklist**
- [ ] Landing page is engaging and responsive.  
- [ ] Authentication flows work seamlessly.  
- [ ] Dashboard displays and manages analyses effectively.  
- [ ] Results page delivers accurate insights.  
- [ ] Subscription management is functional.  
- [ ] App is live and accessible on a custom domain.  

---

This structure ensures a streamlined and user-friendly experience for TubeInsight, covering all essential components. Let me know how else I can assist! 😊