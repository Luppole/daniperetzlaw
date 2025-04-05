
import React, { useState } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { ArticlesList } from './articles/ArticlesList';
import { ArticleForm } from './articles/ArticleForm';

export function AdminArticles() {
  return (
    <Routes>
      <Route index element={<ArticlesList />} />
      <Route path="new" element={<ArticleForm />} />
      <Route path="edit/:id" element={<ArticleForm />} />
      <Route path="*" element={<Navigate to="/admin/articles" replace />} />
    </Routes>
  );
}
