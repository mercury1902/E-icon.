import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminPosts from './AdminPosts';
import AdminComments from './AdminComments';
import AdminReports from './AdminReports';
import AdminActivityLog from './AdminActivityLog';
import './AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="posts" element={<AdminPosts />} />
        <Route path="comments" element={<AdminComments />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="activity" element={<AdminActivityLog />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
