import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AIChatMessage, ChatAction, Coach, CoachInvoice } from '../../../types';
import { Button } from '../../ui/Button';
import InvoicePreviewModal from './InvoicePreviewModal';

interface AIChatWidgetProps {
    clubId: string;
    clubName: string;
    coaches: Coach[];
    onNavigateToTab?: (tab: string) => void;
}

interface UploadedFile {
    name: string;
    size: number;
    type: string;
    uploadedAt: string;
}

type DockSide = 'left' | 'right' | null;

const suggestedPrompts = [
    "How much did each coach earn this month?",
    "Show me students at risk of churning",
    "Compare revenue this month vs last month",
    "What are my optimization recommendations?",
    "Generate invoice for Coach Mike",
    "Which programs have the best profit margins?"
];

// AI Icon Component
const AIIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);

// User Icon Component
const UserIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

// Mock AI responses based on intent
const generateAIResponse = (message: string, coaches: Coach[], uploadedFiles: UploadedFile[]): { content: string; data?: any; actions?: ChatAction[] } => {
    const lowerMsg = message.toLowerCase();
    
    // Coach earnings query
    if (lowerMsg.includes('coach') && (lowerMsg.includes('earn') || lowerMsg.includes('revenue') || lowerMsg.includes('much'))) {
        const coachName = coaches[0]?.name || 'Mike Chen';
        return {
            content: `Coach ${coachName} earned **$4,230** in January 2026 from 47 sessions.\n\n**Breakdown:**\n• Private lessons: $3,400 (40 sessions)\n• Group classes: $830 (7 sessions)\n\nThis is **12% higher** than December ($3,780).`,
            data: { coachId: coaches[0]?.id, earnings: 4230, period: 'January 2026' },
            actions: [
                { id: 'a1', label: 'View Details', type: 'navigate', payload: { tab: 'COACHES' } },
                { id: 'a2', label: 'Generate Invoice', type: 'generate_invoice', payload: { coachId: coaches[0]?.id } }
            ]
        };
    }
    
    // Churn risk query
    if (lowerMsg.includes('churn') || lowerMsg.includes('risk') || lowerMsg.includes('at-risk')) {
        return {
            content: `I found **3 students** at risk of churning:\n\n**Emily Chen** - No activity in 28 days (LTV: $1,240) - High Risk\n**Jason Park** - No activity in 18 days (LTV: $890) - Medium Risk\n**Sarah Miller** - No activity in 16 days (LTV: $650) - Medium Risk\n\n**Suggested:** Send a re-engagement email or offer a special session.`,
            actions: [
                { id: 'a1', label: 'View Students', type: 'navigate', payload: { tab: 'STUDENTS' } },
                { id: 'a2', label: 'Send Outreach', type: 'send_email' }
            ]
        };
    }
    
    // Revenue comparison
    if (lowerMsg.includes('compare') || lowerMsg.includes('vs') || lowerMsg.includes('last month')) {
        return {
            content: `**Revenue Comparison: January vs December**\n\n| Metric | January | December | Change |\n|--------|---------|----------|--------|\n| Total Revenue | $18,450 | $16,200 | +13.9% |\n| Private Lessons | $12,300 | $10,800 | +13.9% |\n| Group Classes | $4,150 | $3,900 | +6.4% |\n| Camps | $2,000 | $1,500 | +33.3% |\n\n**Key insight:** Camp revenue showed strongest growth. Consider expanding camp offerings.`,
            actions: [
                { id: 'a1', label: 'View Revenue Details', type: 'navigate', payload: { tab: 'REVENUE' } }
            ]
        };
    }
    
    // Optimization recommendations
    if (lowerMsg.includes('optim') || lowerMsg.includes('recommend') || lowerMsg.includes('improve') || lowerMsg.includes('suggestion')) {
        const coachName = coaches[0]?.name || 'Coach Mike';
        return {
            content: `**Optimization Recommendations:**\n\n**1. Coach Performance**\n${coachName}'s private lessons have **92% retention** vs 68% for group classes. Consider having them mentor other coaches.\n\n**2. Revenue Opportunity**\nJunior Camps show **3x revenue per hour** ($135/hr) vs adult group classes ($45/hr). Expand camp offerings.\n\n**3. Utilization Alert**\nTuesday & Wednesday 2-4pm slots are 65% empty - **$1,200/week opportunity**.\n\n**4. Retention Focus**\nIntermediate students (3.0-3.5) have lowest retention at 62%. Review intermediate programming.`,
            actions: [
                { id: 'a1', label: 'View Reports', type: 'navigate', payload: { tab: 'REPORTS' } },
                { id: 'a2', label: 'View Revenue', type: 'navigate', payload: { tab: 'REVENUE' } }
            ]
        };
    }
    
    // Profit margins query
    if (lowerMsg.includes('profit') || lowerMsg.includes('margin')) {
        return {
            content: `**Profit Margins by Class Type:**\n\n| Program | Revenue | Est. Costs | Margin |\n|---------|---------|------------|--------|\n| Private Lessons | $12,500 | $8,125 | **35%** |\n| Group Classes | $4,500 | $2,025 | **55%** |\n| Camps | $3,000 | $1,200 | **60%** |\n\n**Insight:** Camps have the highest margin! They're 3x more profitable per hour than private lessons due to multi-student sessions.\n\n**Recommendation:** Expand camp offerings during school breaks to maximize profitability.`,
            actions: [
                { id: 'a1', label: 'View Revenue Analytics', type: 'navigate', payload: { tab: 'REVENUE' } }
            ]
        };
    }
    
    // Time slots
    if (lowerMsg.includes('time') || lowerMsg.includes('slot') || lowerMsg.includes('underperform') || lowerMsg.includes('schedule')) {
        return {
            content: `**Underperforming Time Slots:**\n\n**Tuesday 2-4pm** - 23% utilization ($180/week potential) - Critical\n**Thursday 10am-12pm** - 35% utilization ($140/week potential) - Warning\n**Saturday 8-9am** - 40% utilization ($120/week potential) - Warning\n\n**Total opportunity:** $440/week or **$1,760/month**\n\n**Suggestion:** Run a "Happy Hour" promo for off-peak slots targeting work-from-home professionals and retirees.`,
            actions: [
                { id: 'a1', label: 'View Schedule', type: 'navigate', payload: { tab: 'REPORTS' } }
            ]
        };
    }
    
    // Invoice generation
    if (lowerMsg.includes('invoice') || lowerMsg.includes('generate')) {
        const coachName = coaches[0]?.name || 'Mike Chen';
        return {
            content: `I've generated an invoice for **${coachName}**:\n\n**Invoice #INV-2026-001**\n• Period: January 1-31, 2026\n• Amount: $4,230.00\n• Status: Draft\n\nReady to preview and send. You can also manage all coach invoices in the Revenue > Coach Invoices tab.`,
            data: { 
                invoice: {
                    id: 'inv_001',
                    invoiceNumber: 'INV-2026-001',
                    coachId: coaches[0]?.id,
                    coachName,
                    total: 4230,
                    status: 'draft'
                }
            },
            actions: [
                { id: 'a1', label: 'Preview Invoice', type: 'view_details' },
                { id: 'a2', label: 'Send to Coach', type: 'send_email' },
                { id: 'a3', label: 'View All Invoices', type: 'navigate', payload: { tab: 'REVENUE' } }
            ]
        };
    }

    // File upload query
    if (lowerMsg.includes('upload') || lowerMsg.includes('file') || lowerMsg.includes('document')) {
        if (uploadedFiles.length > 0) {
            return {
                content: `You have **${uploadedFiles.length} file(s)** uploaded:\n\n${uploadedFiles.map(f => `• **${f.name}** (${(f.size / 1024).toFixed(1)} KB)`).join('\n')}\n\nI can analyze these files to provide insights. What would you like to know about your data?`,
                actions: []
            };
        }
        return {
            content: `You can upload files using the **attachment button** below. I support:\n\n• **CSV files** - Payment history, student lists, session data\n• **Excel files** - Spreadsheets with club data\n• **PDF files** - Reports, contracts, schedules\n\nOnce uploaded, I can help analyze the data and provide insights!`,
            actions: []
        };
    }
    
    // Default helpful response
    return {
        content: `I can help you with:\n\n• **Revenue queries** - "How much did Coach X earn?"\n• **Student insights** - "Show at-risk students"\n• **Comparisons** - "Compare this month vs last"\n• **Optimization** - "What are my recommendations?"\n• **Profit analysis** - "Which programs have the best margins?"\n• **Operations** - "Which time slots are underperforming?"\n• **Invoicing** - "Generate invoice for Coach X"\n\nYou can also **upload files** to get custom insights from your data!\n\nWhat would you like to know?`
    };
};

const AIChatWidget: React.FC<AIChatWidgetProps> = ({
    clubId,
    clubName,
    coaches,
    onNavigateToTab
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<AIChatMessage[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const [previewInvoice, setPreviewInvoice] = useState<CoachInvoice | null>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    
    // Dragging state - simpler approach
    const [posX, setPosX] = useState(window.innerWidth - 80);
    const [posY, setPosY] = useState(window.innerHeight - 120);
    const [isDragging, setIsDragging] = useState(false);
    const [dockSide, setDockSide] = useState<DockSide>(null);
    const [isHovering, setIsHovering] = useState(false);
    
    const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
    const hasDraggedRef = useRef(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const BUTTON_SIZE = 56;
    const HIDDEN_AMOUNT = 36; // How much to hide when docked (more than half)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Unified drag handlers
    const handleDragStart = useCallback((clientX: number, clientY: number) => {
        if (isOpen) return;
        
        setIsDragging(true);
        hasDraggedRef.current = false;
        dragStartRef.current = {
            x: clientX,
            y: clientY,
            posX: posX,
            posY: posY
        };
    }, [isOpen, posX, posY]);

    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        if (!isDragging) return;

        const deltaX = clientX - dragStartRef.current.x;
        const deltaY = clientY - dragStartRef.current.y;
        
        // Mark as dragged if moved more than 5px
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasDraggedRef.current = true;
        }

        let newX = dragStartRef.current.posX + deltaX;
        let newY = dragStartRef.current.posY + deltaY;

        // Allow dragging past edges (for docking)
        // But constrain Y to stay in view
        newY = Math.max(20, Math.min(window.innerHeight - BUTTON_SIZE - 20, newY));

        setPosX(newX);
        setPosY(newY);
    }, [isDragging]);

    const handleDragEnd = useCallback(() => {
        if (!isDragging) return;
        
        setIsDragging(false);

        // Check if should dock
        if (posX < -10) {
            // Dock to left - position off screen
            setPosX(-HIDDEN_AMOUNT);
            setDockSide('left');
        } else if (posX > window.innerWidth - BUTTON_SIZE + 10) {
            // Dock to right - position off screen
            setPosX(window.innerWidth - BUTTON_SIZE + HIDDEN_AMOUNT);
            setDockSide('right');
        } else {
            // Not docked - keep within bounds
            setPosX(Math.max(10, Math.min(window.innerWidth - BUTTON_SIZE - 10, posX)));
            setDockSide(null);
        }
    }, [isDragging, posX]);

    // Mouse events
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        handleDragStart(e.clientX, e.clientY);
    }, [handleDragStart]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            handleDragMove(e.clientX, e.clientY);
        };
        
        const handleMouseUp = () => {
            handleDragEnd();
        };

        if (isDragging) {
            // Use capture to get events even when moving fast
            window.addEventListener('mousemove', handleMouseMove, { passive: true });
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    // Touch events
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
    }, [handleDragStart]);

    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            handleDragMove(touch.clientX, touch.clientY);
        };
        
        const handleTouchEnd = () => {
            handleDragEnd();
        };

        if (isDragging) {
            window.addEventListener('touchmove', handleTouchMove, { passive: true });
            window.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isDragging, handleDragMove, handleDragEnd]);

    // Calculate actual display position
    const getDisplayX = () => {
        if (isDragging) {
            return posX; // Raw position while dragging
        }
        
        if (dockSide === 'left') {
            // When docked left: hide most of it, pop out on hover
            return isHovering ? 8 : -HIDDEN_AMOUNT;
        }
        
        if (dockSide === 'right') {
            // When docked right: hide most of it, pop out on hover
            return isHovering 
                ? window.innerWidth - BUTTON_SIZE - 8 
                : window.innerWidth - BUTTON_SIZE + HIDDEN_AMOUNT;
        }
        
        return posX;
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const newFiles: UploadedFile[] = Array.from(files).map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);

        const uploadMessage: AIChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: `**${newFiles.length} file(s) uploaded:**\n\n${newFiles.map(f => `• ${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join('\n')}\n\nI've received your file(s). In the future, I'll be able to analyze this data and provide custom insights. For now, you can ask me about your club's performance, revenue, or operations!`,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, uploadMessage]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: AIChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const response = generateAIResponse(userMessage.content, coaches, uploadedFiles);
        
        const aiMessage: AIChatMessage = {
            id: `msg_${Date.now()}`,
            role: 'assistant',
            content: response.content,
            timestamp: new Date().toISOString(),
            data: response.data,
            actions: response.actions
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
    };

    const handlePromptClick = (prompt: string) => {
        setInputValue(prompt);
        setTimeout(() => handleSend(), 100);
    };

    const handleAction = (action: ChatAction) => {
        switch (action.type) {
            case 'navigate':
                if (action.payload?.tab && onNavigateToTab) {
                    onNavigateToTab(action.payload.tab);
                    setIsOpen(false);
                }
                break;
            case 'generate_invoice':
            case 'view_details':
                const lastMsgWithInvoice = [...messages].reverse().find(m => m.data?.invoice);
                if (lastMsgWithInvoice?.data?.invoice) {
                    const inv = lastMsgWithInvoice.data.invoice;
                    setPreviewInvoice({
                        id: inv.id,
                        invoiceNumber: inv.invoiceNumber,
                        clubId,
                        coachId: inv.coachId || coaches[0]?.id || '',
                        coachName: inv.coachName || coaches[0]?.name || 'Coach',
                        coachEmail: coaches.find(c => c.id === inv.coachId)?.email || 'coach@email.com',
                        periodStart: '2026-01-01',
                        periodEnd: '2026-01-31',
                        lineItems: [
                            { description: 'Private Lessons', programType: 'Private Lesson', sessionCount: 40, rate: 85, amount: 3400 },
                            { description: 'Group Classes', programType: 'Group Class', sessionCount: 7, rate: 118.57, amount: 830 }
                        ],
                        subtotal: 4230,
                        platformFee: 0,
                        total: 4230,
                        status: 'draft',
                        createdAt: new Date().toISOString()
                    });
                    setShowInvoicePreview(true);
                }
                break;
            case 'download_pdf':
                alert('PDF download would start here');
                break;
            case 'send_email':
                alert('Email sending would be triggered here');
                break;
        }
    };

    const handleButtonClick = () => {
        // Only open if we didn't drag
        if (!hasDraggedRef.current) {
            // Undock when opening
            if (dockSide) {
                if (dockSide === 'left') {
                    setPosX(80);
                } else {
                    setPosX(window.innerWidth - BUTTON_SIZE - 80);
                }
                setDockSide(null);
            }
            setIsOpen(true);
        }
    };

    const renderMessage = (message: AIChatMessage) => {
        const isUser = message.role === 'user';
        
        return (
            <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-[85%] ${isUser ? 'order-2' : ''}`}>
                    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isUser ? 'bg-portal-club text-white' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                        }`}>
                            {isUser ? <UserIcon className="w-4 h-4" /> : <AIIcon className="w-4 h-4" />}
                        </div>
                        <div className={`rounded-2xl px-4 py-3 ${
                            isUser 
                                ? 'bg-portal-club text-white rounded-br-md' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-md'
                        }`}>
                            <div className="text-sm whitespace-pre-wrap">
                                {message.content.split('\n').map((line, i) => {
                                    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                                    return (
                                        <p 
                                            key={i} 
                                            className={i > 0 ? 'mt-2' : ''}
                                            dangerouslySetInnerHTML={{ __html: line }}
                                        />
                                    );
                                })}
                            </div>
                            
                            {message.actions && message.actions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200/50">
                                    {message.actions.map(action => (
                                        <button
                                            key={action.id}
                                            onClick={() => handleAction(action)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                isUser
                                                    ? 'bg-white/20 hover:bg-white/30 text-white'
                                                    : 'bg-white hover:bg-gray-50 text-portal-club border border-portal-club/20'
                                            }`}
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* Floating Button - Draggable */}
            {!isOpen && (
                <button
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    onClick={handleButtonClick}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={`fixed top-0 left-0 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 ${
                        isDragging 
                            ? 'cursor-grabbing scale-110 shadow-2xl' 
                            : 'cursor-grab hover:shadow-xl'
                    } ${!isDragging ? 'transition-transform duration-200 ease-out' : ''} ${
                        dockSide && !isHovering && !isDragging ? 'opacity-80' : 'opacity-100'
                    }`}
                    style={{
                        transform: `translate(${getDisplayX()}px, ${posY}px)`,
                        willChange: isDragging ? 'transform' : 'auto',
                    }}
                >
                    <AIIcon className="w-7 h-7" />
                    {/* Pulse indicator */}
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className={`fixed z-50 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                    isExpanded 
                        ? 'inset-4 md:inset-8' 
                        : 'bottom-6 right-6 w-[380px] h-[600px] max-h-[80vh]'
                }`}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <AIIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">KorIQ Assistant</h3>
                                    <p className="text-xs text-white/80">AI-powered insights</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                    title={isExpanded ? 'Minimize' : 'Expand'}
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {isExpanded ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0v5m0-5h5m6 6l5 5m0 0v-5m0 5h-5" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                                        )}
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <AIIcon className="w-8 h-8 text-violet-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">Hi! I'm your KorIQ Assistant</h4>
                                <p className="text-sm text-gray-500 mb-6">
                                    Ask me anything about your club's performance, revenue, or students.
                                </p>
                                <div className="space-y-2 w-full">
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Try asking:</p>
                                    {suggestedPrompts.slice(0, 4).map((prompt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePromptClick(prompt)}
                                            className="w-full text-left px-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm text-gray-700 hover:border-violet-400 hover:bg-violet-50 transition-colors"
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {messages.map(renderMessage)}
                                {isTyping && (
                                    <div className="flex justify-start mb-4">
                                        <div className="flex items-start gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white flex items-center justify-center">
                                                <AIIcon className="w-4 h-4" />
                                            </div>
                                            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Uploaded Files Preview */}
                    {uploadedFiles.length > 0 && (
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs text-gray-500 font-medium">Uploaded:</span>
                                {uploadedFiles.slice(-3).map((file, idx) => (
                                    <span 
                                        key={idx}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs text-gray-700"
                                    >
                                        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        {file.name.length > 15 ? file.name.substring(0, 15) + '...' : file.name}
                                    </span>
                                ))}
                                {uploadedFiles.length > 3 && (
                                    <span className="text-xs text-gray-400">+{uploadedFiles.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                onChange={handleFileUpload}
                                accept=".csv,.xlsx,.xls,.pdf,.txt,.json"
                                multiple
                                className="hidden"
                            />
                            
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-11 h-11 bg-gray-100 text-gray-500 rounded-xl flex items-center justify-center hover:bg-gray-200 hover:text-gray-700 transition-colors flex-shrink-0"
                                title="Upload file for analysis"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                            </button>

                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your question..."
                                className="flex-1 bg-gray-100 text-gray-900 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isTyping}
                                className="w-11 h-11 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-xl flex items-center justify-center hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 text-center">
                            Drag the button to reposition • Supports CSV, Excel, PDF files
                        </p>
                    </div>
                </div>
            )}

            {/* Invoice Preview Modal */}
            {showInvoicePreview && previewInvoice && (
                <InvoicePreviewModal
                    invoice={previewInvoice}
                    onClose={() => {
                        setShowInvoicePreview(false);
                        setPreviewInvoice(null);
                    }}
                    onSend={() => {
                        alert('Invoice would be sent to coach');
                        setShowInvoicePreview(false);
                        setPreviewInvoice(null);
                    }}
                    onDownload={() => {
                        alert('PDF download would start');
                    }}
                />
            )}
        </>
    );
};

export default AIChatWidget;
