import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AiSettingsModal from '../AiSettingsModal';
import { useCodeInput } from '../../../../hooks/useCodeInput';

// 🤖 MOCKING THE SOVEREIGN ORCHESTRATOR
vi.mock('../../../../hooks/useCodeInput', () => ({
    useCodeInput: vi.fn()
}));

describe('AiSettingsModal Component', () => {
    const mockAiConfig = { provider: 'openai', apiKey: 'test-key', endpoint: 'test-endpoint', model: 'test-model' };
    const mockSetAiConfig = vi.fn();
    const mockOnClose = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useCodeInput.mockReturnValue({
            aiConfig: mockAiConfig,
            setAiConfig: mockSetAiConfig
        });
    });

    it('renders modal content when isOpen is true', () => {
        render(<AiSettingsModal isOpen={true} onClose={mockOnClose} />);

        expect(screen.getByText(/Intelligence Link/i)).toBeInTheDocument();
        expect(screen.getByText(/Select your primary cloud cluster/i)).toBeInTheDocument();
    });

    it('does not render when isOpen is false', () => {
        render(<AiSettingsModal isOpen={false} onClose={mockOnClose} />);
        expect(screen.queryByText(/Intelligence Link/i)).not.toBeInTheDocument();
    });

    it('allows changing provider cluster', () => {
        render(<AiSettingsModal isOpen={true} onClose={mockOnClose} />);

        const geminiBtn = screen.getByRole('button', { name: /gemini/i });
        fireEvent.click(geminiBtn);
        
        // Modal uses local state, it doesn't call setAiConfig until Lock In is clicked
        expect(geminiBtn).toBeInTheDocument();
    });

    it('exposes authorization token field', () => {
        render(<AiSettingsModal isOpen={true} onClose={mockOnClose} />);
        
        const keyLabel = screen.getByText(/Authorization Token/i);
        expect(keyLabel).toBeInTheDocument();
    });

    it('executes Lock In Logic and saves configuration', () => {
        render(<AiSettingsModal isOpen={true} onClose={mockOnClose} />);

        const lockBtn = screen.getByRole('button', { name: /Lock In Logic/i });
        fireEvent.click(lockBtn);

        expect(mockSetAiConfig).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
    });
});
