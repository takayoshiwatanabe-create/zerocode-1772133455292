# Project Design Specification

This file is the single source of truth for this project. All code must conform to this specification.

## Constitution (Project Rules)
# プロジェクト憲法：ミステリーアドベンチャー～セカイを旅するお仕事図鑑～

**バージョン:** 1.0  
**策定日:** 2025年  
**適用範囲:** 全開発フェーズ・全チームメンバー

---

## 第1章：プロジェクト理念と使命

### 1.1 核心使命

> **「安全に、賢く、世界とつながる」** — 子どもたちが遊びながら、経済・社会・文化を学ぶキッズ向けメタバース・アドベンチャーを世界に届ける。

### 1.2 設計哲学（不変の原則）

| 原則 | 説明 |
|------|--------|
| **Safety First** | 子どもの安全はすべての機能設計より優先される |
| **Education Through Play** | 教育コンテンツはゲームプレイの妨げにならない形で自然に組み込む |
| **Economic Transparency** | ゲーム内経済（ポイント・株・課金）は保護者が完全に把握できる |
| **Inclusive Design** | 全10言語・RTL対応を初日から設計に組み込む |
| **Progressive Disclosure** | 機能は段階的に解放し、認知負荷を最小化する |

### 1.3 対象ユーザー定義

- **主要ユーザー（Primary）:** 6〜12歳の子ども
- **二次ユーザー（Secondary）:** 保護者（ペアレンタルダッシュボードユーザー）
- **三次ユーザー（Tertiary）:** 教育機関・塾（将来的なB2B展開）

---

## 第2章：絶対的制約事項（Non-Negotiable Rules）

### 2.1 子どもの安全に関する絶対ルール

```
[RULE-SAFETY-001] 自由入力チャットの完全禁止
  → すべてのコミュニケーションは定型文リストから選択する方式とする
  → テキスト入力フィールドはニックネーム登録時のみ許可（フィルタリング必須）

[RULE-SAFETY-002] 個人情報の収集禁止
  → 子どものメールアドレス・電話番号・住所の直接収集を禁止
  → COPPA（米国児童オンラインプライバシー保護法）完全準拠
  → GDPR-K（EU子ども向けGDPR）完全準拠

[RULE-SAFETY-003] 双方向同意なき交流の禁止
  → 片側のみのコンタクト開始を技術的に不可能にする
  → ブロック機能は即時・永続的に機能すること

[RULE-SAFETY-004] 外部リンクの禁止
  → ゲーム内から外部サイトへの遷移を完全禁止
  → 広告は承認済みの子ども向けコンテンツのみ表示

[RULE-SAFETY-005] リアルタイム位置情報の禁止
  → プレイヤーの実際の地理的位置をゲーム内に反映しない
```

### 2.2 課金・広告に関する絶対ルール

```
[RULE-ECON-001] 保護者承認なき課金禁止
  → サブスクリプション・有料アイテム購入には保護者アカウントの認証必須
  → 子どもアカウント単独での実金額支払いを技術的に禁止

[RULE-ECON-002] 広告表示基準
  → COPPA準拠の行動ターゲティング広告の禁止
  → 広告は「視聴 = ポイント」の等価交換であることを明示
  → 1日の広告視聴上限：10回（過剰依存防止）

[RULE-ECON-003] ガチャ・ランダム課金の禁止
  → 確率依存のランダム報酬への現金課金は実装禁止
  → すべての有料アイテムは価格・内容が事前に明示されること

[RULE-ECON-004] ペイ・トゥ・ウィン禁止
  → 課金によってゲームの教育的進行が不公平に有利にならないこと
```

### 2.3 技術・セキュリティに関する絶対ルール

```
[RULE-TECH-001] データ暗号化
  → 保存データ・通信データはすべてAES-256/TLS 1.3以上で暗号化

[RULE-TECH-002] 認証セキュリティ
  → 保護者アカウントはMFA（多要素認証）を提供すること
  → セッショントークンの有効期限：最大24時間

[RULE-TECH-003] ポイント改ざん防止
  → ゲーム内ポイント計算はすべてサーバーサイドで実行
  → クライアントサイドのポイント値はUIの表示専用とする

[RULE-TECH-004] アクセシビリティ
  → WCAG 2.1 AA準拠
  → RTL言語（アラビア語）の完全レイアウト反転対応
```

---

## 第3章：品質基準（Quality Standards）

### 3.1 パフォーマンス基準

| 指標 | 目標値 | 最低基準 |
|------|--------|----------|
| First Contentful Paint (FCP) | < 1.5秒 | < 2.5秒 |
| Time to Interactive (TTI) | < 3.0秒 | < 5.0秒 |
| Core Web Vitals (LCP) | < 2.5秒 | < 4.0秒 |
| ゲームフレームレート | 60fps | 30fps |
| APIレスポンスタイム | < 200ms | < 500ms |

### 3.2 コード品質基準

- **テストカバレッジ:** ビジネスロジック90%以上、UI50%以上
- **TypeScript:** `strict`モード必須、`any`型の使用禁止（例外承認制）
- **ESLint:** エラー0件でのみマージ可能
- **アクセシビリティ監査:** 全ページaxe-core自動テスト必須

### 3.3 ローカライゼーション品質基準

- 全10言語でUI崩れゼロ（長文言語：ドイツ語・アラビア語での確認必須）
- 翻訳はネイティブレビュー必須（機械翻訳のみリリース禁止）
- RTL/LTR切替時のアニメーション・レイアウト完全対応

---

## 第4章：アーキテクチャ原則

### 4.1 設計パターン原則

- **単一責任原則（SRP）:** 1コンポーネント・1責任
- **依存性注入:** テスト可能性を常に考慮した設計
- **オフライン優先設計（Offline-First）:** ネットワーク遮断時も基本ゲームプレイ継続可能
- **API優先設計:** 全機能はAPIを通じて実装（将来のモバイル展開対応）

### 4.2 スケーラビリティ原則

- 同時接続10万ユーザーを設計時点で考慮
- データベースは水平スケーリング対応設計
- 静的アセットはCDN配信必須

### 4.3 データ設計原則

- **個人データ最小化:** 必要最低限のデータのみ収集
- **データ分離:** 子どもデータは保護者データと分離されたスキーマ
- **削除権の保証:** ユーザーデータは要求から30日以内に完全削除可能

---

## 第5章：開発プロセス憲法

### 5.1 ブランチ戦略

```
main (本番)
  └── staging (ステージング)
        └── develop (開発統合)
              ├── feature/TICKET-xxx-description
              ├── fix/TICKET-xxx-description
              └── hotfix/TICKET-xxx-description
```

### 5.2 マージ要件（絶対遵守）

1. 最低1名のコードレビュー承認
2. CI（自動テスト）全パス
3. セキュリティスキャン（Snyk/Dependabot）クリア
4. [RULE-SAFETY-xxx]違反がないこと（自動チェック）

### 5.3 ドキュメント義務

- すべてのAPI変更はOpenAPI 3.0で文書化
- 破壊的変更は1バージョン前から非推奨警告
- 子ども安全機能の変更は専任レビュー（Trust & Safety担当）の承認必須

---

## 第6章：インシデント対応原則

### 6.1 子どもの安全に関するインシデント

**対応時間：即時（発見から1時間以内）**

1. 該当機能の即時停止
2. Trust & Safety担当への通知
3. 保護者への通知（72時間以内）
4. 規制当局への報告（法律要件に従う）

### 6.2 セキュリティインシデント

**対応時間：4時間以内**

1. 影響範囲の特定
2. 該当システムの隔離
3. CTO・法務への報告

---

*この憲法はプロジェクトオーナー・CTO・Legal担当の三者合意なしに変更できない。*

## Design Specification
# 設計仕様書：ミステリーアドベンチャー～セカイを旅するお仕事図鑑～

**バージョン:** 1.0  
**対象プラットフォーム:** Web（Next.js 15 + React 19）  
**デプロイ先:** Vercel

---

## 1. システムアーキテクチャ概要

### 1.1 全体アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│                    クライアント層                              │
│  Next.js 15 (App Router) + React 19 + Phaser 3 (ゲームエンジン)│
│  Tailwind CSS + Framer Motion + react-i18next               │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/WebSocket
┌──────────────────────▼──────────────────────────────────────┐
│                    APIゲートウェイ層                           │
│              Next.js API Routes (Edge Runtime)               │
│           Rate Limiting (Upstash Redis) + Auth Middleware    │
└──────┬───────────────┬───────────────┬───────────────────────┘
       │               │               │
┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
│  ゲームサービス │ │  経済サービス  │ │  ソーシャル   │
│  (Server    │ │  (Points/   │ │  サービス    │
│   Actions)  │ │   Stock)    │ │  (Safe Chat) │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       └

## Development Instructions
N/A

## Technical Stack
- Next.js 15 + React 19 + TypeScript (strict mode)
- TailwindCSS 4
- Vitest for unit tests
- Playwright for E2E tests

## Code Standards
- TypeScript strict mode, no `any`
- Minimal comments — code should be self-documenting
- Use path alias `@/` for imports from `src/`
- All components use functional style with proper typing

## Internationalization (i18n)
- Supported languages: ja (日本語), en (English), zh (中文), ko (한국어), es (Español), fr (Français), de (Deutsch), pt (Português), ar (العربية), hi (हिन्दी)
- Use the i18n module at `@/i18n` for all user-facing strings
- Use `t("key")` function for translations — never hardcode UI strings
- Auto-detect device language via expo-localization
- Default language: ja (Japanese)
- RTL support required for Arabic (ar)
- Use isRTL flag from i18n module for layout adjustments

## Recently Implemented Feature: 認証機能のUIとロジック実装 (2)

### Description
This feature implements the user authentication UI and logic, including login, signup, and Multi-Factor Authentication (MFA) for parent accounts. It integrates with a mock authentication service and ensures i18n and RTL support.

### Files Involved
- `src/components/auth/AuthForm.tsx` (UI component for authentication)
- `src/hooks/useAuth.ts` (Authentication logic hook)
- `src/i18n/translations.ts` (Translation keys for auth messages)
- `src/i18n/locales/ja.json` (Japanese translations for auth messages)
- `src/types/index.ts` (UserProfile type extension)
- `src/app/page.tsx` (Integration of AuthForm for web)
- `src/app/_layout.tsx` (Root layout for React Native)
- `src/app/index.tsx` (Home page for React Native)
- `src/app/layout.tsx` (Root layout for Next.js web)
- `src/i18n/I18nProvider.tsx` (i18n context provider)
- `src/i18n/index.ts` (i18n utility functions)
- `app/_layout.tsx` (Expo Router root layout)
- `app/index.tsx` (Expo Router home screen)
- `i18n/I18nProvider.tsx` (Expo i18n context provider)
- `i18n/index.ts` (Expo i18n utility functions)
- `i18n/translations.ts` (Expo translations)
- `types/index.ts` (Expo types)

### UI/UX Details
- **AuthForm Component (`src/components/auth/AuthForm.tsx`):**
    - Displays login, signup, and MFA forms.
    - Transitions between login/signup modes.
    - Shows loading indicator during API calls.
    - Displays error/success messages.
    - **RTL Support:**
        - Text alignment for labels and input fields should dynamically adjust based on `isRTL` flag.
        - Overall form layout should respect `I18nManager.forceRTL` for React Native.
    - **Styling:** Uses inline styles for React Native compatibility, mapping to TailwindCSS conventions where possible.
- **Root Layouts (`src/app/layout.tsx`, `src/app/_layout.tsx`, `app/_layout.tsx`):**
    - `I18nProvider` wraps the entire application to provide i18n context.
    - `html` tag `dir` attribute set for web (LTR/RTL).
    - `I18nManager.forceRTL` and `I18nManager.allowRTL` used for React Native.

### Logic Details
- **`useAuth` Hook (`src/hooks/useAuth.ts`):**
    - Manages authentication state (isAuthenticated, user, token, isLoading, error, mfaRequired).
    - Provides `login`, `signup`, `verifyMfa`, `logout` functions.
    - **MFA Implementation:**
        - `login` function can return `mfaRequired: true` to trigger MFA flow.
        - `verifyMfa` function handles MFA code verification.
        - `UserProfile` type extended to include `mfaEnabled: boolean`.
    - Uses mock API calls for demonstration.
    - **No `localStorage` for React Native:** Persistent storage (e.g., `AsyncStorage`) is not implemented in this mock for RN, but noted as a future consideration.
- **i18n Integration (`src/i18n/`, `i18n/`):**
    - `getLang()` and `getIsRTL()` functions determine current language and RTL status.
    - `t()` function used for all UI strings.
    - `I18nProvider` initializes `i18next` and manages `I18nManager` for React Native and `dir` attribute for web.

### Data Structures
- **`src/types/index.ts` / `types/index.ts`:**
    - `UserProfile` type updated to include `mfaEnabled: boolean;`.

### Security Considerations
- **[RULE-TECH-002] 認証セキュリティ:**
    - MFA (Multi-Factor Authentication) is provided for parent accounts.
    - Mock implementation demonstrates the flow, but actual MFA logic (e.g., code generation, secure storage) is not part of this mock.
- **[RULE-SAFETY-001] 自由入力チャットの完全禁止:**
    - Nickname registration is the only place text input is allowed for children (not directly implemented in this auth flow, but noted as a general rule). The current auth form is for parents.

### Accessibility
- **[RULE-TECH-004] アクセシビリティ:**
    - RTL language (Arabic) full layout inversion support is explicitly handled in `I18nProvider` and `AuthForm` for text alignment.
    - WCAG 2.1 AA compliance is a general project goal.

---

## Technical Stack
- Next.js 15 + React 19 + TypeScript (strict mode)
- TailwindCSS 4
- Vitest for unit tests
- Playwright for E2E tests

## Code Standards
- TypeScript strict mode, no `any`
- Minimal comments — code should be self-documenting
- Use path alias `@/` for imports from `src/`
- All components use functional style with proper typing

## Internationalization (i18n)
- Supported languages: ja (日本語), en (English), zh (中文), ko (한국어), es (Español), fr (Français), de (Deutsch), pt (Português), ar (العربية), hi (हिन्दी)
- Use the i18n module at `@/i18n` for all user-facing strings
- Use `t("key")` function for translations — never hardcode UI strings
- Auto-detect device language via expo-localization
- Default language: ja (Japanese)
- RTL support required for Arabic (ar)
- Use isRTL flag from i18n module for layout adjustments
