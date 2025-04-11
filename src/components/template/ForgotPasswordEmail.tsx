import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  url : string
}

export const ForgotPasswordEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
  url
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>Reset password <a href={url} target='_black'>Click Here</a> to reset.</p>
  </div>
);