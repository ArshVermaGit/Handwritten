import PageLayout from '../../components/layout/PageLayout';

export default function CookiePolicy() {
    return (
        <PageLayout 
            title="Cookie Policy" 
            subtitle="How we use cookies to improve your experience."
        >
            <h3>What Are Cookies?</h3>
            <p>
                Cookies are simple text files that are stored on your computer or mobile device by a website’s server. Each cookie is unique to your web browser. It will contain some anonymous information such as a unique identifier, website’s domain name, and some digits and numbers.
            </p>

            <h3>How We Use Cookies</h3>
            <p>
                We use cookies for the following purposes:
            </p>
            <ul>
                <li><strong>Functionality:</strong> To remember your preferences (like your selected font, ink color, or paper type) so you don't have to reset them every time you visit.</li>
                <li><strong>Analytics:</strong> To understand how visitors interact with our website, helping us improve the user experience.</li>
            </ul>

            <h3>Managing Cookies</h3>
            <p>
                You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work.
            </p>
            <p className="text-sm text-neutral-400 mt-8">
                Last updated: January 29, 2026
            </p>
        </PageLayout>
    );
}
