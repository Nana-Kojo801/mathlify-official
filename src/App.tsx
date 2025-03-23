import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import SplashScreen from "./components/splash-screen";
import NotFoundPage from "./routes/not-found";

// Lazy load components
const RootLayout = lazy(() => import("@/routes/layout.tsx"));
const IndexPage = lazy(() => import("@/routes/page.tsx"));
const AuthLayout = lazy(() => import("@/routes/(auth)/layout.tsx"));
const SignupPage = lazy(() => import("@/routes/(auth)/signup/page.tsx"));
const LoginPage = lazy(() => import("@/routes/(auth)/login/page.tsx"));
const AppLayout = lazy(() => import("@/routes/(app)/layout.tsx"));
const HomePage = lazy(() => import("@/routes/(app)/page.tsx"));
const PracticePage = lazy(() => import("@/routes/(app)/practice/page.tsx"));
const CasualPracticePlayPage = lazy(
  () => import("@/routes/(app)/practice/casual/page.tsx")
);
const MarathonPage = lazy(() => import("@/routes/(app)/marathon/page.tsx"));
const MarathonPlayPage = lazy(
  () => import("@/routes/(app)/marathon/play/page.tsx")
);
const AnswerRushPlayPage = lazy(
  () => import("@/routes/(app)/practice/answer-rush/page.tsx")
);
const EditProfilePage = lazy(
  () => import("./routes/(app)/profile/edit-profile/page.tsx")
);
const SearchUsersPage = lazy(
  () => import("./routes/(app)/search-users/page.tsx")
);
const FriendRequestsPage = lazy(
  () => import("./routes/(app)/friend-requests/page.tsx")
);
const FriendChatPage = lazy(() => import("./routes/(app)/chat/page.tsx"));
const ProfilePage = lazy(() => import("./routes/(app)/profile/page.tsx"));
// const OnlinePage = lazy(() => import("./routes/(app)/online/page.tsx"));
// const CreateRoomPage = lazy(
//   () => import("./routes/(app)/online/create-room/page.tsx")
// );
// const RoomPage = lazy(() => import("./routes/(app)/online/room/page.tsx"));
// const MembersPage = lazy(
//   () => import("./routes/(app)/online/room/members/page.tsx")
// );
// const RoomSuspenseLayout = lazy(
//   () => import("./routes/(app)/online/room/layout.tsx")
// );
// const JoinRoomPage = lazy(
//   () => import("./routes/(app)/online/join-room/page.tsx")
// );
// const RoomChatPage = lazy(
//   () => import("./routes/(app)/online/room/chat/page.tsx")
// );
// const GameSettingsPage = lazy(
//   () => import("./routes/(app)/online/room/game-settings/page.tsx")
// );
// const OnlinePlayPage = lazy(
//   () => import("./routes/(app)/online/room/play/page.tsx")
// );

const App = () => {
  return (
    <Suspense fallback={<SplashScreen />}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<IndexPage />} />

          <Route path="auth" element={<AuthLayout />}>
            <Route path="signup" element={<SignupPage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route path="app" element={<AppLayout />}>
            <Route index element={<HomePage />} />

            <Route path="practice" element={<PracticePage />}>
              <Route path="casual" element={<CasualPracticePlayPage />} />
              <Route path="answer-rush" element={<AnswerRushPlayPage />} />
            </Route>

            <Route path="marathon" element={<MarathonPage />}>
              <Route path="play" element={<MarathonPlayPage />} />
            </Route>

            <Route path="profile/:userId" element={<ProfilePage />} />
            <Route path="profile/edit" element={<EditProfilePage />} />

            <Route path="search-users" element={<SearchUsersPage />} />
            <Route path="friend-requests" element={<FriendRequestsPage />} />
            <Route path="chat-friend/:friendId" element={<FriendChatPage />} />

            {/* <Route path="online" element={<OnlinePage />} />
            <Route path="online/create-room" element={<CreateRoomPage />} />
            <Route path="online/join-room" element={<JoinRoomPage />} />
            <Route path="online/room/:roomId" element={<RoomSuspenseLayout />}>
              <Route index element={<RoomPage />} />
              <Route path="members" element={<MembersPage />} />
              <Route path="chat" element={<RoomChatPage />} />
              <Route path="game-settings" element={<GameSettingsPage />} />
              <Route path="play" element={<OnlinePlayPage />} />
            </Route> */}
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
