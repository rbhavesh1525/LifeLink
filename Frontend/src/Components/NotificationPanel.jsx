import React, { useState, useEffect } from 'react';
import { useChat } from '../context/MessageContext';
import { showToast } from './Toast';

function NotificationPanel({ isOpen, onClose }) {
    const { 
        notifications = [], 
        markNotificationAsRead, 
        updateTransferStatus 
    } = useChat();
    
    // Local copy of notifications to prevent render issues
    const [localNotifications, setLocalNotifications] = useState([]);

    // Update local state whenever notifications change
    useEffect(() => {
        setLocalNotifications([...notifications]);
    }, [notifications]);

    // Sort notifications by timestamp (newest first)
    const sortedNotifications = [...localNotifications].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const handleNotificationClick = (notification) => {
        // Mark as read in context
        markNotificationAsRead(notification.id);
        
        // Also update local state for immediate UI feedback
        setLocalNotifications(prev => prev.map(item => 
            item.id === notification.id ? { ...item, read: true } : item
        ));
        
        showToast(`Viewed notification`, 'info');
    };

    const handleAcceptTransfer = (e, transfer, notificationId) => {
        e.stopPropagation(); // Prevent parent click handler
        
        try {
            updateTransferStatus(transfer._id, 'accepted');
            
            // Mark as read in context
            markNotificationAsRead(notificationId);
            
            // Also update local state for immediate UI feedback
            setLocalNotifications(prev => prev.map(item => 
                item.id === notificationId ? { ...item, read: true } : item
            ));
            
            showToast('Transfer request accepted', 'success');
        } catch (error) {
            console.error('Error accepting transfer:', error);
            showToast('Failed to accept transfer', 'error');
        }
    };

    const handleRejectTransfer = (e, transfer, notificationId) => {
        e.stopPropagation(); // Prevent parent click handler
        
        try {
            updateTransferStatus(transfer._id, 'rejected');
            
            // Mark as read in context
            markNotificationAsRead(notificationId);
            
            // Also update local state for immediate UI feedback
            setLocalNotifications(prev => prev.map(item => 
                item.id === notificationId ? { ...item, read: true } : item
            ));
            
            showToast('Transfer request rejected', 'error');
        } catch (error) {
            console.error('Error rejecting transfer:', error);
            showToast('Failed to reject transfer', 'error');
        }
    };

    // Format timestamp to readable format
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            const date = new Date(timestamp);
            return date.toLocaleString();
        } catch (e) {
            return 'Unknown date';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
            <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-lg">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                        Notifications 
                        <span className="ml-2 text-sm text-gray-500">
                            ({sortedNotifications.length})
                        </span>
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {sortedNotifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        No notifications
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {sortedNotifications.map((notification) => (
                            <div 
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                className={`p-4 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                            >
                                <div className="flex items-start">
                                    <div className="ml-3 flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-gray-900">
                                                {notification.type === 'transfer' && 'New Transfer Request'}
                                                {notification.type === 'transferStatus' && 'Transfer Status Update'}
                                            </span>
                                            {!notification.read && (
                                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="mt-1 text-sm text-gray-500">
                                            {notification.type === 'transfer' && notification.data && (
                                                <>Patient: {notification.data.name}, Condition: {notification.data.condition}</>
                                            )}
                                            {notification.type === 'transferStatus' && notification.data && (
                                                <>Status: {notification.data.status}</>
                                            )}
                                        </div>
                                        
                                        <div className="mt-2 text-xs text-gray-400">
                                            {formatTime(notification.timestamp)}
                                        </div>
                                        
                                        {/* Action buttons for transfer requests */}
                                        {notification.type === 'transfer' && !notification.read && (
                                            <div className="mt-2 flex space-x-2">
                                                <button
                                                    onClick={(e) => handleAcceptTransfer(e, notification.data, notification.id)}
                                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={(e) => handleRejectTransfer(e, notification.data, notification.id)}
                                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default NotificationPanel; 