import { Route, Routes } from "react-router";
import { Suspense, lazy } from "react";
import SplashScreen from "./components/splash-screen";
import NotFoundPage from "./routes/not-found";

// Lazy load components
const RootLayout = lazy(() => import("@/routes/layout"));
const IndexPage = lazy(() => import("@/routes/page"));
const AuthLayout = lazy(() => import("@/routes/(auth)/layout"));
const SignupPage = lazy(() => import("@/routes/(auth)/signup/page"));
const LoginPage = lazy(() => import("@/routes/(auth)/login/page"));
const AppLayout = lazy(() => import("@/routes/(app)/layout"));
const HomePage = lazy(() => import("@/routes/(app)/page"));
const PracticePage = lazy(() => import("@/routes/(app)/practice/page"));
const CasualPracticePlayPage = lazy(
  () => import("@/routes/(app)/practice/casual/page")
);
const MarathonPage = lazy(() => import("@/routes/(app)/marathon/page"));
const MarathonPlayPage = lazy(
  () => import("@/routes/(app)/marathon/play/page")
);
const AnswerRushPlayPage = lazy(
  () => import("@/routes/(app)/practice/answer-rush/page")
);
const EditProfilePage = lazy(
  () => import("./routes/(app)/profile/edit-profile/page")
);
const SearchUsersPage = lazy(() => import("./routes/(app)/search-users/page"));
const FriendRequestsPage = lazy(
  () => import("./routes/(app)/friend-requests/page")
);
const FriendChatPage = lazy(() => import("./routes/(app)/chat/page"));
const ProfilePage = lazy(() => import("./routes/(app)/profile/page"));
const OnlinePage = lazy(() => import("./routes/(app)/online/page"));
const CreateRoomPage = lazy(
  () => import("./routes/(app)/online/create-room/page")
);
const RoomPage = lazy(() => import("./routes/(app)/online/room/page"));
const MemebersPage = lazy(
  () => import("./routes/(app)/online/room/members/page")
);
const RoomSuspenseLayout = lazy(
  () => import("./routes/(app)/online/room/layout")
);
const JoinRoomPage = lazy(() => import("./routes/(app)/online/join-room/page"));
const RoomChatPage = lazy(() => import("./routes/(app)/online/room/chat/page"));
const GameSettingsPage = lazy(
  () => import("./routes/(app)/online/room/game-settings/page")
);
const OnlinePlayPage = lazy(
  () => import("./routes/(app)/online/room/play/page")
);

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

            <Route path="online" element={<OnlinePage />} />
            <Route path="online/create-room" element={<CreateRoomPage />} />
            <Route path="online/join-room" element={<JoinRoomPage />} />
            <Route path="online/room/:roomId" element={<RoomSuspenseLayout />}>
              <Route index element={<RoomPage />} />
              <Route path="members" element={<MemebersPage />} />
              <Route path="chat" element={<RoomChatPage />} />
              <Route path="game-settings" element={<GameSettingsPage />} />
              <Route path="play" element={<OnlinePlayPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />}/>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
