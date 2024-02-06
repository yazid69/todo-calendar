import Avatar from '@mui/material/Avatar';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { deepOrange } from '@mui/material/colors';

interface ProfileAvatarProps {
    src: string;
    name: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ src, name, onClick }) => {
    return (
        <Stack direction="row" spacing={2} onClick={onClick}>
            <Avatar src="/broken-image.jpg" />

        </Stack>
    );

};

export default ProfileAvatar;

// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import Stack from '@mui/material/Stack';
// import { deepOrange } from '@mui/material/colors';

// export default function FallbackAvatars() {
//     return (
//         <Stack direction="row" spacing={2}>
//             <Avatar
//                 sx={{ bgcolor: deepOrange[500] }}
//                 alt="Remy Sharp"
//                 src="/broken-image.jpg"
//             >
//                 B
//             </Avatar>
//             <Avatar
//                 sx={{ bgcolor: deepOrange[500] }}
//                 alt="Remy Sharp"
//                 src="/broken-image.jpg"
//             />
//             <Avatar src="/broken-image.jpg" />
//         </Stack>
//     );
// }