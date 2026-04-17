import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AiSettingsModal from '../AiSettingsModal';

describe('AiSettingsModal Component', () => {
    const mockConfig = { provider: 'openai', apiKey: '', endpoint: '', model: '' };
    const mockSetConfig = vi.fn();
    const mockOnClose = vi.fn();

    it('renders modal content when isOpen is true', () => {
        render(
            <AiSettingsModal 
                isOpen={true} 
                onClose={mockOnClose} 
                config={mockConfig} 
                setConfig={mockSetConfig} 
            />
        );

        expect(screen.getByText(/Intelligence Link/i)).toBeInTheDocument();
        expect(screen.getByText(/Sovereign Agent Configuration/i)).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        render(
            <AiSettingsModal 
                isOpen={false} 
                onClose={mockOnClose} 
                config={mockConfig} 
                setConfig={mockSetConfig} 
            />
        );

        expect(screen.queryByText(/Intelligence Link/i)).not.toBeInTheDocument();
    });

    it('calls setConfig when a different provider is selected', () => {
        render(
            <AiSettingsModal 
                isOpen={true} 
                onClose={mockOnClose} 
                config={mockConfig} 
                setConfig={mockSetConfig} 
            />
        );

        const geminiBtn = screen.getByRole('button', { name: /gemini/i });
        fireEvent.click(geminiBtn);

        expect(mockSetConfig).toHaveBeenCalled();
        const callArg = mockSetConfig.mock.calls[0][0];
        // We expect it to be a function or the new config object
        // The component uses setConfig({...config, provider: p})
    });

    it('allows inputting authorization token for supported providers', () => {
        render(
            <AiSettingsModal 
                isOpen={true} 
                onClose={mockOnClose} 
                config={mockConfig} 
                setConfig={mockSetConfig} 
            />
        );

        const apiKeyInput = screen.getByLabelText(/openai key/i);
        fireEvent.change(apiKeyInput, { target: { value: 'sk-test-123' } });

        expect(mockSetConfig).toHaveBeenCalled();
    });

    it('closes modal when form is submitted', () => {
        render(
            <AiSettingsModal 
                isOpen={true} 
                onClose={mockOnClose} 
                config={mockConfig} 
                setConfig={mockSetConfig} 
            />
        );

        const submitBtn = screen.getByRole('button', { name: /Lock In Logic/i });
        fireEvent.submit(submitBtn.closest('form'));

        expect(mockOnClose).toHaveBeenCalled();
    });
});
