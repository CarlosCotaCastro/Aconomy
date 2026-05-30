import { Link, useForm } from '@inertiajs/react';
import {
    Box,
    Grid,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    Person as PersonIcon,
} from '@mui/icons-material';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from "@/Components/PrimaryButton.jsx";
import { useTranslation } from 'react-i18next';
import GroupTeaser from '@/Pages/Groups/Partials/GroupTeaser';

export default function Index({ groups, auth }: any) {

    const { t } = useTranslation();

    return (
        <AuthenticatedLayout user={auth.user}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h2" component="h1">
                    My Groups
                </Typography>
                <Box>
                    <PrimaryButton
                        component={Link}
                        href={route('groups.create')}
                        variant="contained"
                        startIcon={<AddIcon />}
                        disabled={false}
                    >
                        {t('groups.createGroup')}
                    </PrimaryButton>
                </Box>
            </Box>

            <Grid container spacing={3}>
                {groups && groups.map((group: any) => {
                    return <GroupTeaser key={group.id} group={group} user={auth.user} />;
                })}
            </Grid>
        </AuthenticatedLayout>
    );
}
