import React, { useState } from 'react';
import './MissingConfig.css';

const REQUIRED_VARS = `VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY`;

export default function MissingConfig() {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(REQUIRED_VARS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnableDemoMode = () => {
    localStorage.setItem('bypass_supabase_check', 'true');
    window.location.reload();
  };

  const steps = [
    {
      label: '1. Variables',
      title: 'Identify Required Environment Variables',
      content: (
        <>
          <p className="step-pane-desc">
            To connect your application to your database on Vercel, you need to configure the following environment variables. Copy the templates below:
          </p>
          <div className="code-container">
            <button 
              className={`copy-btn${copied ? ' copied' : ''}`} 
              onClick={handleCopy}
              aria-label="Copy environment variables to clipboard"
            >
              {copied ? '✓ Copied' : '📋 Copy Keys'}
            </button>
            <pre className="code-block">
              <code>{REQUIRED_VARS}</code>
            </pre>
          </div>
          <p className="step-pane-desc" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
            💡 You can find the actual values in your local <code>.env</code> file.
          </p>
        </>
      ),
    },
    {
      label: '2. Vercel Panel',
      title: 'Navigate to Vercel Environment Settings',
      content: (
        <>
          <p className="step-pane-desc">
            Open the Vercel dashboard and navigate to your project settings:
          </p>
          <div className="step-pane-desc">
            <ol>
              <li>Go to <strong>Vercel Dashboard</strong> and click on this project.</li>
              <li>Select the <strong>Settings</strong> tab from the top navigation bar.</li>
              <li>Click on <strong>Environment Variables</strong> in the left sidebar.</li>
            </ol>
          </div>
        </>
      ),
    },
    {
      label: '3. Add Keys',
      title: 'Enter Environment Values',
      content: (
        <>
          <p className="step-pane-desc">
            Add the keys and values one by one in the fields provided:
          </p>
          <div className="step-pane-desc">
            <ol>
              <li>In the <strong>Key</strong> field, type: <code>VITE_SUPABASE_URL</code>.</li>
              <li>In the <strong>Value</strong> field, paste your Supabase URL value from your local <code>.env</code>.</li>
              <li>Click the <strong>Add</strong> button to save.</li>
              <li>Repeat the steps for <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.</li>
            </ol>
          </div>
        </>
      ),
    },
    {
      label: '4. Deploy',
      title: 'Redeploy the Application',
      content: (
        <>
          <p className="step-pane-desc">
            Once you have added both variables, Vercel needs a new deployment to pick up the updated settings:
          </p>
          <div className="step-pane-desc">
            <ol>
              <li>Go to the <strong>Deployments</strong> tab in your Vercel project.</li>
              <li>Find your latest deployment, click the three dots (<code>...</code>) on the right, and select <strong>Redeploy</strong>.</li>
              <li>Alternatively, push a new commit to your GitHub repository to trigger an automatic rebuild.</li>
            </ol>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="missing-config-container">
      <div className="missing-config-card">
        <div className="missing-config-header">
          <div className="missing-config-badge">
            <span role="img" aria-label="warning">⚠️</span> Configuration Required
          </div>
          <h1 className="missing-config-title">Deployment Config Required</h1>
          <p className="missing-config-subtitle">
            Your application was deployed successfully, but it needs connection keys to access database features.
          </p>
        </div>

        {/* Steps Tab Navigation */}
        <nav className="steps-nav" aria-label="Setup guide steps">
          {steps.map((step, idx) => (
            <button
              key={idx}
              className={`step-tab${activeStep === idx ? ' active' : ''}`}
              onClick={() => setActiveStep(idx)}
              aria-current={activeStep === idx ? 'step' : undefined}
            >
              <span className="step-tab-num">Step {idx + 1}</span>
              <span>{step.label.split('. ')[1]}</span>
            </button>
          ))}
        </nav>

        {/* Step Pane */}
        <div className="step-pane">
          <div>
            <h2 className="step-pane-title">{steps[activeStep].title}</h2>
            {steps[activeStep].content}
          </div>

          <div className="step-actions">
            <button
              className="btn-secondary"
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
            >
              Back
            </button>
            {activeStep < steps.length - 1 ? (
              <button
                className="btn-primary"
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
              >
                Next Step
              </button>
            ) : (
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                Go to Vercel ↗
              </a>
            )}
          </div>
        </div>

        {/* Bypass / Offline Demo Mode Option */}
        <div className="missing-config-footer">
          <p className="demo-text">
            Want to inspect the UI and view the app without setting up the database?
          </p>
          <button className="btn-demo" onClick={handleEnableDemoMode}>
            Preview Demo Mode (Offline / Mock)
          </button>
        </div>
      </div>
    </div>
  );
}
